import type { AuroraEventJson } from "../AuroraTypes";

export class AuroraEvent {
    public auroraEventId: number;
    public bins: Array<any>;
    public eventAt: number;
    public flags: number;
    public id: number;
    public time: number;

    constructor(src: AuroraEventJson) {
        this.auroraEventId = src.aurora_event_id;
        this.bins = src.bins;
        // 端末の CSV 由来イベントは date（epoch ms）を持ち event_at を持たないため、
        // グラフの X 軸（eventAt）は date へフォールバックする。
        this.eventAt = src.event_at ?? src.date ?? 0;
        this.id = src.id;
        this.flags = src.flags;
        this.time = src.time;
    }
}
