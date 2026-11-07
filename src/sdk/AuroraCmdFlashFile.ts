import type { FirmwareDownloadProgress } from "../types";
import type { Aurora } from "./Aurora";

const AuroraCmdFlashFile = async function (
    this: Aurora,
    fwPath: string,
    fwVersion: number | false | undefined = false,
    fwType = "app",
    onPhase?: (phase: "downloading" | "uploading" | "flashing") => void,
    onDownloadProgress?: (progress: FirmwareDownloadProgress) => void,
): Promise<unknown> {
    //TODO: this condition is for backwards compatibility
    const filename = fwType == "app" ? "aurora.hex" : `aurora-${fwType}.hex`;

    onPhase?.("downloading");
    await this.uploadFile(fwPath, filename, false, onDownloadProgress, () =>
        onPhase?.("uploading"),
    );
    onPhase?.("flashing");
    return this.flash(filename, fwVersion, fwType);
};

export default AuroraCmdFlashFile;
