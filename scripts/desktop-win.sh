#!/usr/bin/env bash
set -euo pipefail

# WSL2 のソースを Windows 側ミラーへ同期し、Windows の ElectroBun デバッグビルドを起動する。
# 使い方: scripts/desktop-win.sh <ミラー先> [sync|install|export|setup|dev] [--dry-run]

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

# --- i18n（LANG で ja / zh / en を切替） ---
LANG_CODE=ja
case "${LANG:-}" in
  ja*) LANG_CODE=ja ;;
  zh*) LANG_CODE=zh ;;
  *) LANG_CODE=en ;;
esac

declare -A MSGS
MSGS[ja:usage]=$'使い方: scripts/desktop-win.sh <ミラー先> [コマンド] [--dry-run]\n\n  WSL2 のソースを Windows 側ミラーへ同期し、Windows の ElectroBun デバッグビルドを起動します。\n  <ミラー先> は /mnt/c/dev/owl-of-athena-win（WSL 形式）または "C:\\dev\\owl-of-athena-win"（Windows 形式）。\n  Windows 形式はバックスラッシュがシェルに解釈されるため、引用符で囲むか「C:/dev/owl-of-athena-win」のスラッシュ区切りで指定してください。\n\n  コマンド:\n    sync    ソース（.git / node_modules / dist 等を除く）をミラーへ同期\n    install Windows 側で bun install --frozen-lockfile（Windows に bun が必須）\n    export  Windows 側で expo export --platform web（dist 生成）\n    setup   同期 + install + export を一度に実行（初回セットアップ）\n    dev     同期 + 必要時 install/export + desktop:dev を起動（既定）\n\n  --dry-run  同期の実行内容だけ表示します。\n  注意: .env / .env.local（Supabase キー）も同期されます。'
MSGS[en:usage]=$'Usage: scripts/desktop-win.sh <mirror-dir> [command] [--dry-run]\n\n  Syncs the WSL2 source to a Windows mirror and launches the Windows ElectroBun debug build.\n  <mirror-dir> can be /mnt/c/dev/owl-of-athena-win (WSL form) or "C:\\dev\\owl-of-athena-win" (Windows form).\n  For the Windows form, quote it or use forward slashes (C:/dev/owl-of-athena-win), otherwise bash eats the backslashes.\n\n  Commands:\n    sync    Sync source (excluding .git / node_modules / dist etc.) to the mirror\n    install Run bun install --frozen-lockfile on Windows (bun required on Windows)\n    export  Run expo export --platform web on Windows (generates dist)\n    setup   Run sync + install + export at once (initial bootstrap)\n    dev     Sync + install/export when needed + launch desktop:dev (default)\n\n  --dry-run  Only show what the sync would do.\n  Note: .env / .env.local (Supabase keys) are synced as well.'
MSGS[zh:usage]=$'用法: scripts/desktop-win.sh <镜像目录> [命令] [--dry-run]\n\n  将 WSL2 源码同步到 Windows 侧镜像，并启动 Windows 版 ElectroBun 调试构建。\n  <镜像目录> 可使用 /mnt/c/dev/owl-of-athena-win（WSL 格式）或 "C:\\dev\\owl-of-athena-win"（Windows 格式）。\n  Windows 格式的反斜杠会被 shell 吞掉，请加引号或改用正斜杠「C:/dev/owl-of-athena-win」。\n\n  命令:\n    sync    将源码（不含 .git / node_modules / dist 等）同步到镜像\n    install 在 Windows 侧执行 bun install --frozen-lockfile（需要 Windows 版 bun）\n    export  在 Windows 侧执行 expo export --platform web（生成 dist）\n    setup   一次执行 同步 + install + export（首次初始化）\n    dev     同步 + 按需 install/export + 启动 desktop:dev（默认）\n\n  --dry-run  仅显示同步将要执行的内容。\n  注意: .env / .env.local（Supabase 密钥）也会被同步。'

# エラー系メッセージは parse より前に定義する（parse 中に利用されるため）
MSGS[ja:err_bad_path]=$'パス形式を解釈できません: %s\n（WSL 形式 /mnt/... または Windows 形式 "C:\\..." / C:/... で指定）'
MSGS[en:err_bad_path]=$'Cannot parse path: %s\n(use /mnt/... or a quoted Windows path "C:\\..." / C:/...)'
MSGS[zh:err_bad_path]=$'无法解析路径: %s\n（请使用 /mnt/... 格式，或带引号的 "C:\\..." / C:/... 格式）'
MSGS[ja:err_bad_path_win]=$'Windows パスを解釈できません: %s\nシェルがバックスラッシュを解釈した可能性があります。\n引用符で囲って「"D:\\dev\\owl-of-athena-win"」にするか「D:/dev/owl-of-athena-win」とスラッシュ区切りで指定してください。'
MSGS[en:err_bad_path_win]=$'Cannot parse Windows path: %s\nThe shell may have eaten the backslashes.\nQuote it ("D:\\dev\\owl-of-athena-win") or use forward slashes (D:/dev/owl-of-athena-win).'
MSGS[zh:err_bad_path_win]=$'无法解析 Windows 路径: %s\n可能是 shell 吞掉了反斜杠。\n请加引号（"D:\\dev\\owl-of-athena-win"）或使用正斜杠形式（D:/dev/owl-of-athena-win）。'

msg() {
  local key="$1"
  shift
  local fmt="${MSGS[$LANG_CODE:$key]:-$key}"
  printf '%s\n' "$(printf "$fmt" "$@")"
}

# --- 引数解析 ---
DRY=0
MIRROR=""
CMD="dev"
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY=1 ;;
    sync | install | export | setup | dev) CMD="$arg" ;;
    -h | --help) msg usage; exit 0 ;;
    *) MIRROR="$arg" ;;
  esac
done

if [ -z "$MIRROR" ]; then
  msg usage
  exit 1
fi

# --- パス正規化（/mnt/... ⇔ C:\...） ---
WIN_MIRROR=""
WSL_MIRROR=""
if [[ "$MIRROR" =~ ^/mnt/[a-zA-Z]/ ]]; then
  WSL_MIRROR="$MIRROR"
  WIN_MIRROR="$(wslpath -w "$MIRROR")"
elif [[ "$MIRROR" =~ ^[a-zA-Z]:[/\\] ]]; then
  WIN_MIRROR="$(printf '%s' "$MIRROR" | tr '/' '\\')"
  WSL_MIRROR="$(wslpath -u "$WIN_MIRROR")"
elif [[ "$MIRROR" =~ ^[a-zA-Z]:[^/\\]*$ ]]; then
  # バックスラッシュをシェルに解釈された形（例: D:devowl-of-athena-win）の可能性が高い
  msg err_bad_path_win "$MIRROR"
  exit 1
else
  msg err_bad_path "$MIRROR"
  exit 1
fi

MSGS[ja:err_unknown_cmd]=$'不明なコマンド: %s'
MSGS[en:err_unknown_cmd]=$'Unknown command: %s'
MSGS[zh:err_unknown_cmd]=$'未知命令: %s'
MSGS[ja:err_no_mirror_dir]=$'ミラーが見つかりません: %s\n先に「setup」または「sync」を実行してください。'
MSGS[en:err_no_mirror_dir]=$'Mirror not found: %s\nRun "setup" or "sync" first.'
MSGS[zh:err_no_mirror_dir]=$'未找到镜像: %s\n请先执行 "setup" 或 "sync"。'
MSGS[ja:err_no_bun]=$'Windows 側で bun を確認できません（未インストール、または Windows コマンドが無応答）。\nPowerShell で「winget install Oven-sh.Bun」を実行してから再実行してください。'
MSGS[en:err_no_bun]=$'Cannot confirm bun on Windows (not installed, or the Windows command did not respond).\nRun "winget install Oven-sh.Bun" in PowerShell first.'
MSGS[zh:err_no_bun]=$'无法在 Windows 侧确认 bun（未安装，或 Windows 命令无响应）。\n请先在 PowerShell 中执行 "winget install Oven-sh.Bun"。'
MSGS[ja:sync_start]=$'▶ 同期中: %s → %s'
MSGS[en:sync_start]=$'▶ Syncing: %s → %s'
MSGS[zh:sync_start]=$'▶ 同步中: %s → %s'
MSGS[ja:sync_done]=$'✓ 同期完了: %s'
MSGS[en:sync_done]=$'✓ Synced: %s'
MSGS[zh:sync_done]=$'✓ 同步完成: %s'
MSGS[ja:dry_run]=$'（ドライラン: 実際には実行しません）'
MSGS[en:dry_run]=$'(dry-run: nothing will be executed)'
MSGS[zh:dry_run]=$'（dry-run: 不实际执行）'
MSGS[ja:install_run]=$'▶ Windows 側で bun install --frozen-lockfile を実行します（初回は数分かかります）'
MSGS[en:install_run]=$'▶ Running bun install --frozen-lockfile on Windows (first run may take minutes)'
MSGS[zh:install_run]=$'▶ 正在 Windows 侧执行 bun install --frozen-lockfile（首次可能需要数分钟）'
MSGS[ja:install_skip]=$'＝ install は不要です（package.json / bun.lock に変更なし）'
MSGS[en:install_skip]=$'= install skipped (package.json / bun.lock unchanged)'
MSGS[zh:install_skip]=$'＝ 跳过 install（package.json / bun.lock 未变化）'
MSGS[ja:export_run]=$'▶ Windows 側で expo export --platform web を実行します'
MSGS[en:export_run]=$'▶ Running expo export --platform web on Windows'
MSGS[zh:export_run]=$'▶ 正在 Windows 侧执行 expo export --platform web'
MSGS[ja:export_skip]=$'＝ export は不要です（dist は最新）'
MSGS[en:export_skip]=$'= export skipped (dist is up to date)'
MSGS[zh:export_skip]=$'＝ 跳过 export（dist 已是最新）'
MSGS[ja:dev_launch]=$'▶ デバッグビルドを起動します（ウィンドウは Windows デスクトップに表示）。Ctrl+C で停止'
MSGS[en:dev_launch]=$'▶ Launching the debug build (the window will appear on the Windows desktop). Ctrl+C to stop'
MSGS[zh:dev_launch]=$'▶ 正在启动调试构建（窗口显示在 Windows 桌面）。Ctrl+C 停止'
MSGS[ja:setup_done]=$'✓ セットアップ完了。次回からは「scripts/desktop-win.sh %s dev」で起動できます。'
MSGS[en:setup_done]=$'✓ Setup complete. From next time run "scripts/desktop-win.sh %s dev".'
MSGS[zh:setup_done]=$'✓ 初始化完成。下次可执行「scripts/desktop-win.sh %s dev」启动。'

# --- ヘルパー ---
# Windows 側のカレントをミラーにしてコマンドを実行する
win_run() {
  local label="$1"
  shift
  msg "$label"
  # cmd.exe は UNC（\\wsl.localhost\...）を起動ディレクトリにできず、
  # その後の cd /d より先に失敗する。interop は /mnt/... のカレントを
  # Windows パスへ翻訳してプロセスを起動するため、ミラーを cwd にした
  # サブシェルから起動すれば cd も UNC 警告も不要になる。
  ( cd "$WSL_MIRROR" && cmd.exe /c "$*" )
}

win_has_bun() {
  # 一過性の interop ハング対策として 30 秒で打ち切る
  ( cd "$WSL_MIRROR" && timeout 30 cmd.exe /c "bun --version" ) >/dev/null 2>&1
}

# 依存変更の有無（package.json / bun.lock がソース側で新しい場合）
needs_install() {
  [ -d "$WSL_MIRROR/node_modules" ] || return 0
  [ "$ROOT_DIR/package.json" -nt "$WSL_MIRROR/package.json" ] && return 0
  [ "$ROOT_DIR/bun.lock" -nt "$WSL_MIRROR/bun.lock" ] && return 0
  return 1
}

# dist の要再生成（ソースのいずれかがミラー側 dist/index.html より新しい場合）
needs_export() {
  [ -f "$WSL_MIRROR/dist/index.html" ] || return 0
  local refs=(App.tsx app.json app.config.ts babel.config.js tsconfig.json package.json)
  local target="$WSL_MIRROR/dist/index.html"
  if found=$(find "$ROOT_DIR/src" "$ROOT_DIR/assets" "${refs[@]/#/$ROOT_DIR/}" -newer "$target" -print -quit 2>/dev/null); then
    [ -n "$found" ] && return 0
  fi
  return 1
}

# --- コマンド本体 ---
EXCLUDES=(
  --exclude '.git'
  --exclude '.idea'
  --exclude '.expo'
  --exclude '.qwen'
  --exclude 'node_modules'
  --exclude 'dist'
  --exclude 'dist-desktop'
  --exclude 'dist-desktop-artifacts'
  --exclude 'build'
  --exclude 'web-build'
  --exclude 'coverage'
  --exclude 'web'
  --exclude 'android'
  --exclude 'ios'
  --exclude '*.apk'
)

cmd_sync() {
  echo "# ROOT: $ROOT_DIR"
  echo "# MIRROR(WSL): $WSL_MIRROR"
  echo "# MIRROR(WIN): $WIN_MIRROR"
  mkdir -p "$WSL_MIRROR"
  msg sync_start "$ROOT_DIR" "$WSL_MIRROR"
  [ "$DRY" -eq 1 ] && msg dry_run
  # -rt: 再帰 + 時刻保持（drvfs での権限ノイズを避ける）、--delete: ミラー整合
  if [ "$DRY" -eq 1 ]; then
    rsync -rtn --delete "${EXCLUDES[@]}" "$ROOT_DIR/" "$WSL_MIRROR/"
  else
    rsync -rt --delete -q "${EXCLUDES[@]}" "$ROOT_DIR/" "$WSL_MIRROR/"
  fi
  msg sync_done "$WSL_MIRROR"
}

cmd_install() {
  win_has_bun || { msg err_no_bun; exit 1; }
  win_run install_run "bun install --frozen-lockfile"
}

cmd_export() {
  win_has_bun || { msg err_no_bun; exit 1; }
  win_run export_run "bun run build:web"
}

cmd_setup() {
  cmd_sync
  cmd_install
  cmd_export
  msg setup_done "$MIRROR"
}

cmd_dev() {
  cmd_sync
  if needs_install; then
    cmd_install
  else
    msg install_skip
  fi
  if needs_export; then
    cmd_export
  else
    msg export_skip
  fi
  win_has_bun || { msg err_no_bun; exit 1; }
  win_run dev_launch "bun run desktop:dev"
}

case "$CMD" in
  sync) cmd_sync ;;
  install) cmd_install ;;
  export) cmd_export ;;
  setup) cmd_setup ;;
  dev)
    if [ -d "$WSL_MIRROR" ] || find "$WSL_MIRROR" -maxdepth 0 -print -quit >/dev/null 2>&1; then
      cmd_dev
    else
      msg err_no_mirror_dir "$WSL_MIRROR"
      exit 1
    fi
    ;;
  *)
    msg err_unknown_cmd "$CMD"
    exit 1
    ;;
esac