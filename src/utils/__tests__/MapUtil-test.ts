import { MapUtil } from "../";

describe("MapUtil Test", () => {
    it("calculate should correct work", async () => {
        const region = MapUtil.calculateRegion(35.658577, 139.745451, 20);

        expect(region.latitude).toBe(35.658577);
        expect(region.latitudeDelta).toBe(0.00008983111749910169);
        expect(region.longitude).toBe(139.745451);
        expect(region.longitudeDelta).toBe(0.0005512656726328332);
    });

    it("calculate distance should correct work", async () => {
        const distanceKm = MapUtil.getDistance(
            35.131549,
            137.183946,
            35.131163,
            137.18974
        );

        expect(distanceKm).toBe(0.5286463932752867);

        const distanceM = MapUtil.getDistance(
            35.131549,
            137.183946,
            35.131163,
            137.18974,
            { distanceUnit: "m", trunc: true }
        );

        expect(distanceM).toBe(528);
    });
});
