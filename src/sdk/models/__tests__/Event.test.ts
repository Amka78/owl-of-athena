import { EventIds } from "../../AuroraConstants";
import { Event } from "../Event";

describe("Event-test", () => {
    it("toMask works correctly", () => {
        const eventArray: EventIds[] = [];

        eventArray.push(EventIds.AUTO_SHUTDOWN);
        eventArray.push(EventIds.BUTTON_MONITOR);

        expect(Event.toMask(eventArray).toString(16)).toBe("10020");
    });
});
