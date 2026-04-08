import { Event } from "../Event";
import { EventIds } from "../../AuroraConstants";
describe("Event-test", () => {
    it("toMask works correctly", () => {
        const eventArray = new Array<EventIds>();

        eventArray.push(EventIds.AUTO_SHUTDOWN);
        eventArray.push(EventIds.BUTTON_MONITOR);

        expect(Event.toMask(eventArray).toString(16)).toBe("10020");
    });
});
