import type { Aurora } from "./Aurora";

const AuroraCmdFlashFile = async function (
    this: Aurora,
    fwPath: string,
    fwVersion: number | false | undefined = false,
    fwType = "app",
    onPhase?: (phase: "uploading" | "flashing") => void,
): Promise<unknown> {
    //TODO: this condition is for backwards compatibility
    const filename = fwType == "app" ? "aurora.hex" : `aurora-${fwType}.hex`;

    onPhase?.("uploading");
    await this.uploadFile(fwPath, filename);
    onPhase?.("flashing");
    return this.flash(filename, fwVersion, fwType);
};

export default AuroraCmdFlashFile;
