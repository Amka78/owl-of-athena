// TEMP DIAGNOSTIC: Profiles一覧の再描画ループの発生層を特定するための一時ログ。原因特定後に削除する。

const renderCounts = new Map<string, number>();
const lastRenderLogAt = new Map<string, number>();

export const traceRender = (name: string, detail?: Record<string, unknown>): void => {
    const count = (renderCounts.get(name) ?? 0) + 1;
    renderCounts.set(name, count);

    const now = Math.round(performance.now());
    const lastAt = lastRenderLogAt.get(name) ?? -1000;
    if (count > 10 && now - lastAt < 1000) return;

    lastRenderLogAt.set(name, now);
    console.log(`TEMP DIAGNOSTIC ${JSON.stringify({ t: now, name, count, ...detail })}`);
};

let layoutCount = 0;
let lastLayoutSignature = "";
let lastLayoutLogAt = -1000;

export const traceLayout = (width: number, height: number): void => {
    layoutCount += 1;
    const signature = `${width.toFixed(2)}x${height.toFixed(2)}`;
    const now = Math.round(performance.now());

    if (layoutCount > 10 && signature === lastLayoutSignature) return;
    if (layoutCount > 10 && now - lastLayoutLogAt < 100) return;

    lastLayoutSignature = signature;
    lastLayoutLogAt = now;
    console.log(
        `TEMP DIAGNOSTIC ${JSON.stringify({ t: now, name: "onLayout", count: layoutCount, width, height })}`,
    );
};
