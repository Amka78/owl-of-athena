import AuroraCmdFlashFile from "../AuroraCmdFlashFile";

const runFlash = async (
    fwType: string,
    uploadFile: jest.Mock,
    flash: jest.Mock,
    onDownloadProgress = jest.fn(),
): Promise<{ phases: string[]; onDownloadProgress: jest.Mock }> => {
    const phases: string[] = [];
    await (AuroraCmdFlashFile as any).call(
        { uploadFile, flash },
        "https://example.test/firmware.hex",
        10500,
        fwType,
        (phase: string) => phases.push(phase),
        onDownloadProgress,
    );
    return { phases, onDownloadProgress };
};

const uploadWithProgress = (): jest.Mock =>
    jest.fn((_src, _dest, _rename, onProgress, onDownloaded) => {
        onProgress?.({ loaded: 5, total: 10 });
        onDownloaded?.();
        return Promise.resolve();
    });

describe("AuroraCmdFlashFile UnitTest", () => {
    it("reports downloading, uploading, then flashing for the app firmware", async () => {
        const uploadFile = uploadWithProgress();
        const flash = jest.fn(() => Promise.resolve("ok"));

        const { phases } = await runFlash("app", uploadFile, flash);

        expect(uploadFile).toHaveBeenCalledWith(
            "https://example.test/firmware.hex",
            "aurora.hex",
            false,
            expect.any(Function),
            expect.any(Function),
        );
        expect(flash).toHaveBeenCalledWith("aurora.hex", 10500, "app");
        expect(phases).toEqual(["downloading", "uploading", "flashing"]);
    });

    it("forwards download progress", async () => {
        const uploadFile = uploadWithProgress();
        const flash = jest.fn(() => Promise.resolve("ok"));

        const { onDownloadProgress } = await runFlash("app", uploadFile, flash);

        expect(onDownloadProgress).toHaveBeenCalledWith({ loaded: 5, total: 10 });
    });

    it("uses the component file name", async () => {
        const uploadFile = uploadWithProgress();
        const flash = jest.fn(() => Promise.resolve("ok"));

        await runFlash("bootloader-and-bootstrap", uploadFile, flash);

        expect(uploadFile).toHaveBeenCalledWith(
            "https://example.test/firmware.hex",
            "aurora-bootloader-and-bootstrap.hex",
            false,
            expect.any(Function),
            expect.any(Function),
        );
        expect(flash).toHaveBeenCalledWith(
            "aurora-bootloader-and-bootstrap.hex",
            10500,
            "bootloader-and-bootstrap",
        );
    });

    it("does not start flashing when the download or upload fails", async () => {
        const uploadFile = jest.fn(() => Promise.reject(new Error("network")));
        const flash = jest.fn(() => Promise.resolve("ok"));

        await expect(runFlash("app", uploadFile, flash)).rejects.toThrow("network");
        expect(flash).not.toHaveBeenCalled();
    });
});
