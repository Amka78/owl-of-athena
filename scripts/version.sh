#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

usage() {
  cat <<'EOF'
使い方: bun run version <patch|minor|major|x.y.z> [--push]

  package.json / app.config.ts / electrobun.config.ts の version を更新し、
  コミット + annotated タグを作成します。
  既定では push しません。--push 指定時のみ、確認の上でブランチとタグを push します。

注意:
  タグ v* の push で EAS Update（preview チャンネルへ OTA 配信）が起動します（preview-release.yml）。
  ブランチを main へ push すると Web 版の GitHub Pages 公開（pages.yml）も起動します。
EOF
}

PUSH="false"
ARGS=()
for arg in "$@"; do
  case "$arg" in
    --push) PUSH="true" ;;
    -h | --help)
      usage
      exit 0
      ;;
    *) ARGS+=("$arg") ;;
  esac
done
set -- "${ARGS[@]}"

if [ $# -ne 1 ]; then
  usage
  exit 1
fi
bump=$1

# --- 現在のバージョンを取得 ---
OLD_VERSION=$(node -e "console.log(require('./package.json').version)")

# --- 新しいバージョンを計算 ---
if [[ "$bump" =~ ^(patch|minor|major)$ ]]; then
  NEW_VERSION=$(node -e "
    const v = require('./package.json').version.split('.').map(Number);
    if ('$bump' === 'major') v[0]++, v[1] = 0, v[2] = 0;
    else if ('$bump' === 'minor') v[1]++, v[2] = 0;
    else v[2]++;
    console.log(v.join('.'));
  ")
elif [[ "$bump" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  NEW_VERSION="$bump"
else
  echo "エラー: '$bump' は無効です。patch, minor, major, または x.y.z を指定してください。"
  exit 1
fi

if [ "$OLD_VERSION" = "$NEW_VERSION" ]; then
  echo "エラー: 新バージョンが現バージョンと同じです ($OLD_VERSION)"
  exit 1
fi

# --- 事前チェック: 作業ツリー ---
DIRTY=$(git status --porcelain | grep -v '^??' || true)
if [ -n "$DIRTY" ]; then
  echo "エラー: 変更された tracked ファイルがあります。先にコミットまたはスタッシュしてください。"
  echo "$DIRTY" | head -n 10
  exit 1
fi
UNTRACKED=$(git status --porcelain | grep '^??' || true)
if [ -n "$UNTRACKED" ]; then
  echo "注意: untracked ファイルが存在します（コミットには含めません）。"
  echo "$UNTRACKED" | head -n 5
fi

# --- 事前チェック: リモート同期・タグ重複 ---
REMOTE_OK="false"
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if git fetch origin --quiet 2>/dev/null && git rev-parse --verify "origin/$BRANCH" >/dev/null 2>&1; then
  REMOTE_OK="true"
  AHEAD=$(git rev-list --count "origin/$BRANCH..HEAD")
  BEHIND=$(git rev-list --count "HEAD..origin/$BRANCH")
  if [ "$AHEAD" -ne 0 ] || [ "$BEHIND" -ne 0 ]; then
    echo "エラー: HEAD が origin/$BRANCH と同期していません（ahead $AHEAD / behind $BEHIND）。先に push / pull してください。"
    exit 1
  fi
else
  echo "注意: origin との通信に失敗したため、同期とリモートタグの確認を省略しました。必要なら先に git fetch してください。"
fi

if git tag --list "v$NEW_VERSION" | grep -q .; then
  echo "エラー: タグ v$NEW_VERSION はローカルに既に存在します"
  exit 1
fi
if [ "$REMOTE_OK" = "true" ] && git ls-remote --exit-code --tags origin "refs/tags/v$NEW_VERSION" >/dev/null 2>&1; then
  echo "エラー: タグ v$NEW_VERSION はリモートに既に存在します"
  exit 1
fi

# --- ファイル更新（置換を検証しながら） ---
node -e "
  const fs = require('fs');
  const NEW = '$NEW_VERSION';

  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  if (pkg.version === NEW) {
    console.error('エラー: package.json の version が既に ' + NEW + ' です');
    process.exit(1);
  }
  pkg.version = NEW;
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');

  // app.config.ts は version: \"x.y.z\"、electrobun.config.ts は
  // version: process.env.ELECTROBUN_APP_VERSION ?? \"x.y.z\" のフォールバックを更新する。
  const versionTargets = ['app.config.ts', 'electrobun.config.ts'];
  for (const file of versionTargets) {
    const cfg = fs.readFileSync(file, 'utf8');
    const re = file === 'electrobun.config.ts'
      ? /(version:\s*process\.env\.ELECTROBUN_APP_VERSION[^\n]*\")[^\"]*(\")/
      : /(version:\s*\")[^\"]*(\")/;
    const m = cfg.match(re);
    if (!m) {
      console.error('エラー: ' + file + ' に version が見つかりません');
      process.exit(1);
    }
    if (m[2] === NEW) {
      console.error('エラー: ' + file + ' の version が既に ' + NEW + ' です');
      process.exit(1);
    }
    fs.writeFileSync(file, cfg.replace(re, '\$1' + NEW + '\$2'));
  }
"

# --- 更新の検証（3ファイルの version が一致しているか） ---
VERIFY_PKG=$(node -e "console.log(require('./package.json').version)")
VERIFY_CFG=$(node -e "
  const m = require('fs').readFileSync('app.config.ts', 'utf8').match(/version:\s*\"([^\"]*)\"/);
  process.stdout.write(m ? m[1] : '');
")
VERIFY_DESKTOP=$(node -e "
  const m = require('fs').readFileSync('electrobun.config.ts', 'utf8').match(/ELECTROBUN_APP_VERSION[^\n]*\"([^\"]*)\"/);
  process.stdout.write(m ? m[1] : '');
")
if [ "$VERIFY_PKG" != "$NEW_VERSION" ] || [ "$VERIFY_CFG" != "$NEW_VERSION" ] || [ "$VERIFY_DESKTOP" != "$NEW_VERSION" ]; then
  echo "エラー: バージョン更新の検証に失敗しました（pkg=$VERIFY_PKG / cfg=$VERIFY_CFG / desktop=$VERIFY_DESKTOP）。変更を元に戻します。"
  git checkout -- package.json app.config.ts electrobun.config.ts
  exit 1
fi

echo "  package.json:    $OLD_VERSION → $NEW_VERSION"
echo "  app.config.ts:   $OLD_VERSION → $NEW_VERSION"
echo "  electrobun:      $OLD_VERSION → $NEW_VERSION"

# --- コミット + annotated タグ ---
git add package.json app.config.ts electrobun.config.ts
git commit -m "v$NEW_VERSION にバージョンアップ"
git tag -a "v$NEW_VERSION" -m "v$NEW_VERSION をリリース"

echo ""
echo "✓ v$NEW_VERSION を作成しました。"

if [ "$PUSH" = "true" ]; then
  echo ""
  echo "⚠ タグ push で以下が起動します:"
  echo "  - preview-release.yml: EAS Update で preview チャンネルへ OTA 配信"
  echo "  - ブランチ push 時: pages.yml（Web 版の GitHub Pages 公開）"
  read -r -p "ブランチとタグを origin に push しますか? [y/N]: " confirmed
  if [[ "$confirmed" =~ ^[Yy]$ ]]; then
    git push origin HEAD
    git push origin "v$NEW_VERSION"
    echo "✓ push 完了: origin/$BRANCH と v$NEW_VERSION"
  else
    echo "push をスキップしました。手動で実行:"
    echo "  git push origin HEAD && git push origin v$NEW_VERSION"
  fi
else
  echo "  push する場合は: git push origin HEAD && git push origin v$NEW_VERSION"
  echo "  → push すると preview-release.yml（OTA 配信）が起動します"
fi