import { AuroraEventJson } from "../AuroraTypes";

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
        this.eventAt = src.event_at;
        this.id = src.id;
        this.flags = src.flags;
        this.time = src.time;
    }
}
