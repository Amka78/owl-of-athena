import { AuroraEvent, AuroraStream } from "../models";

export class AuroraSessionDetail {
    public sessionId: string;
    public awakeningEvents: Array<AuroraEvent>;
    public buttonEvents: Array<AuroraEvent>;
    public movementEvents: Array<AuroraEvent>;
    public sleepEvents: Array<AuroraEvent>;
    public stimEvents: Array<AuroraEvent>;
    public streams: Array<AuroraStream>;

    constructor(
        sessionId: string,
        streams: Array<AuroraStream>,
        awakeningEvents: Array<AuroraEvent>,
        buttonEvents: Array<AuroraEvent>,
        movementEvents: Array<AuroraEvent>,
        sleepEvents: Array<AuroraEvent>,
        stimeEvents: Array<AuroraEvent>
    ) {
        this.sessionId = sessionId;
        this.streams = streams;
        this.awakeningEvents = awakeningEvents;
        this.buttonEvents = buttonEvents;
        this.movementEvents = movementEvents;
        this.sleepEvents = sleepEvents;
        this.stimEvents = stimeEvents;
    }
}
