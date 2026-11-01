#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

usage() {
  cat <<'EOF'
使い方: bun run eas:<platform>:<profile> （例: bun run eas:android:preview）

  eas build --local を実行します。Android ビルドが成功すると、
  生成された APK を wsl-avd でエミュレータにインストールするか選択できます。
EOF
}

if [ $# -ne 2 ]; then
  usage
  exit 1
fi
PLATFORM=$1
PROFILE=$2

case "$PLATFORM" in
  android | ios) ;;
  *)
    echo "エラー: プラットフォーム '$PLATFORM' は無効です。android または ios を指定してください。"
    exit 1
    ;;
esac

echo "▶ eas build --platform $PLATFORM --profile $PROFILE --local"

if [ "$PLATFORM" = "android" ]; then
  BEFORE=$(ls build-*.apk 2>/dev/null || true)
fi

if ! eas build --platform "$PLATFORM" --profile "$PROFILE" --local; then
  echo "エラー: EAS ビルドが失敗しました。"
  exit 1
fi

[ "$PLATFORM" = "android" ] || exit 0

# --- ビルドで生成された APK を特定（既定は build-<タイムスタンプ>.apk） ---
APK=$(comm -13 <(printf '%s\n' "$BEFORE") <(ls build-*.apk 2>/dev/null || true) | head -n 1)
if [ -z "$APK" ]; then
  # 差分で特定できない場合（同名上書き時）は最新の APK を採用
  APK=$(ls -t build-*.apk 2>/dev/null | head -n 1)
fi
if [ -z "$APK" ]; then
  echo "エラー: build-*.apk が出力されませんでした。"
  exit 1
fi

echo ""
echo "✓ ビルド完了: $APK"
read -r -p "wsl-avd でエミュレータにインストールしますか? [y/N]: " confirmed
if [[ "$confirmed" =~ ^[Yy]$ ]]; then
  if command -v wsl-avd >/dev/null 2>&1; then
    wsl-avd --install "$APK"
  else
    echo "エラー: wsl-avd が見つかりません。npm i -g wsl-avd でインストールしてください。"
    exit 1
  fi
else
  echo "インストールをスキップしました。APK: $APK"
fi