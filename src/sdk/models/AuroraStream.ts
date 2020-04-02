import { AuroraStreamJson } from "../AuroraTypes";

export class AuroraStream {
    public auroraSessionId: string;
    public auroraStreamId: number;
    public config?: string;
    public dataType: number;
    public duration: number;
    public file: string;
    public id: number;
    public streamAt: number;
    public url: string;
    public userId: string;
    constructor(src: AuroraStreamJson) {
        this.auroraSessionId = src.aurora_session_id;
        this.auroraStreamId = src.aurora_stream_id;
        if (src.config !== null) {
            this.config = src.config;
        }
        this.dataType = src.data_type;
        this.duration = src.duration;
        this.file = src.file;
        this.id = src.id;
        this.streamAt = src.stream_at;
        this.url = src.url;
        this.userId = src.user_id;
    }
}
