export class AuroraOSInfo {
    public version: number;
    public bootstrapVersion: number;
    public bootloaderVersion: number;
    public bleVersion: number;
    public batteryLevel: number;
    public profileLoaded: boolean;
    public profile: any;
    constructor(osInfo: Partial<AuroraOSInfo>) {
        console.log(osInfo);
        this.version = osInfo.version ? osInfo.version : 0;
        this.bootstrapVersion = osInfo.bootstrapVersion
            ? osInfo.bootstrapVersion
            : 0;
        this.bootloaderVersion = osInfo.bootloaderVersion
            ? osInfo.bootloaderVersion
            : 0;
        this.bleVersion = osInfo.bleVersion ? osInfo.bleVersion : 0;
        this.batteryLevel = osInfo.batteryLevel
            ? Number(osInfo.batteryLevel.toString().replace("%", ""))
            : 0;
        this.profileLoaded = osInfo.profile && osInfo.profile.equals("NO");
    }
}
