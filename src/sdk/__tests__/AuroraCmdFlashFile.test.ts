import AuroraCmdFlashFile from "../AuroraCmdFlashFile";

const runFlash = async (
    fwType: string,
    uploadFile: jest.Mock,
    flash: jest.Mock,
): Promise<string[]> => {
    const phases: string[] = [];
    await (AuroraCmdFlashFile as any).call(
        { uploadFile, flash },
        "https://example.test/firmware.hex",
        10500,
        fwType,
        (phase: string) => phases.push(phase),
    );
    return phases;
};

describe("AuroraCmdFlashFile UnitTest", () => {
    it("reports uploading then flashing for the app firmware", async () => {
        const uploadFile = jest.fn(() => Promise.resolve());
        const flash = jest.fn(() => Promise.resolve("ok"));

        const phases = await runFlash("app", uploadFile, flash);

        expect(uploadFile).toHaveBeenCalledWith("https://example.test/firmware.hex", "aurora.hex");
        expect(flash).toHaveBeenCalledWith("aurora.hex", 10500, "app");
        expect(phases).toEqual(["uploading", "flashing"]);
    });

    it("uses the component file name", async () => {
        const uploadFile = jest.fn(() => Promise.resolve());
        const flash = jest.fn(() => Promise.resolve("ok"));

        await runFlash("bootloader-and-bootstrap", uploadFile, flash);

        expect(uploadFile).toHaveBeenCalledWith(
            "https://example.test/firmware.hex",
            "aurora-bootloader-and-bootstrap.hex",
        );
        expect(flash).toHaveBeenCalledWith(
            "aurora-bootloader-and-bootstrap.hex",
            10500,
            "bootloader-and-bootstrap",
        );
    });

    it("does not start flashing when the upload fails", async () => {
        const uploadFile = jest.fn(() => Promise.reject(new Error("network")));
        const flash = jest.fn(() => Promise.resolve("ok"));

        await expect(runFlash("app", uploadFile, flash)).rejects.toThrow("network");
        expect(flash).not.toHaveBeenCalled();
    });
});
