import { EventIds } from "../AuroraConstants";
export class Event {
    public static toMask(eventTypes: EventIds[]): number {
        let mask = 0;

        eventTypes.forEach((value: EventIds) => {
            mask |= 1 << value;
        });

        return mask;
    }
}
