import { Aurora } from "./Aurora";

const AuroraCmdFlashFile = async function(
    this: Aurora,
    fwPath: string,
    fwVersion: number | false | undefined = false,
    fwType = "app"
): Promise<unknown> {
    //TODO: this condition is for backwards compatibility
    const filename = fwType == "app" ? "aurora.hex" : `aurora-${fwType}.hex`;

    return this.uploadFile(fwPath, filename).then(() => {
        return this.flash(filename, fwVersion, fwType);
    });
};

export default AuroraCmdFlashFile;
