export default function(
    fwPath: string,
    fwVersion = false,
    fwType = "app"
): unknown {
    //TODO: this condition is for backwards compatibility
    const filename = fwType == "app" ? "aurora.hex" : `aurora-${fwType}.hex`;

    // @ts-ignore
    return this.uploadFile(fwPath, filename).then(() => {
        // @ts-ignore
        return this.flash(filename, fwVersion, fwType);
    });
}
