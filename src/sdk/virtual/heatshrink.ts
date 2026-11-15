/**
 * Heatshrink エンコーダ（window=8bit / lookahead=4bit）。
 *
 * Aurora 実機の sd-file-read / sd-file-write は compress=1 のとき heatshrink で圧縮する。
 * アプリ側の復号は heatshrink-ts の HeatshrinkDecoder(8, 4, …) が受け持つため、
 * このエンコーダはそのデコーダが読むビット列を出力する:
 *  - タグビット 1 → リテラル 1 バイト
 *  - タグビット 0 → バックリファレンス（インデックス=距離-1 を window ビット、長さ-1 を lookahead ビット）
 *  - ビットは各バイトの MSB から順に詰める（decoder の getBits と同じ順序）
 *
 * タグの割り当ては iWinks 系の heatshrink（HEATSHRINK_LITERAL_MARKER=0x01）に合わせる。
 */

const WINDOW_BITS = 8;
const LOOKAHEAD_BITS = 4;
const WINDOW_SIZE = 1 << WINDOW_BITS; // 256
const MAX_MATCH_LENGTH = 1 << LOOKAHEAD_BITS; // 16
const MIN_MATCH_LENGTH = 2;

export class HeatshrinkEncoder {
    public static encode(input: Uint8Array): Uint8Array {
        if (input.byteLength === 0) return new Uint8Array(0);

        const out: number[] = [];
        let bitBuf = 0;
        let bitCount = 0;

        const pushBits = (value: number, count: number): void => {
            for (let i = count - 1; i >= 0; i--) {
                bitBuf = (bitBuf << 1) | ((value >> i) & 1);
                bitCount += 1;
                if (bitCount === 8) {
                    out.push(bitBuf);
                    bitBuf = 0;
                    bitCount = 0;
                }
            }
        };

        const flush = (): void => {
            if (bitCount > 0) {
                pushBits(0, 8 - bitCount);
            }
        };

        let i = 0;
        while (i < input.byteLength) {
            const maxLen = Math.min(MAX_MATCH_LENGTH, input.byteLength - i);
            const maxDist = Math.min(i, WINDOW_SIZE);

            let bestLen = 0;
            let bestDist = 0;

            for (let d = 1; d <= maxDist; d++) {
                if (input[i - d] !== input[i]) continue;

                let len = 0;
                while (len < maxLen && input[i - d + len] === input[i + len]) {
                    len += 1;
                }

                if (len > bestLen) {
                    bestLen = len;
                    bestDist = d;
                    if (len === maxLen) break;
                }
            }

            if (bestLen >= MIN_MATCH_LENGTH) {
                pushBits(0, 1);
                pushBits(bestDist - 1, WINDOW_BITS);
                pushBits(bestLen - 1, LOOKAHEAD_BITS);
                i += bestLen;
            } else {
                pushBits(1, 1);
                pushBits(input[i], 8);
                i += 1;
            }
        }

        flush();
        return Uint8Array.from(out);
    }
}
