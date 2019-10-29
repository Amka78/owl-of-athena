/*data class AuroraOsInfo (

    val version: Long,
    val bootstrapVersion: Long,
    val bootloaderVersion: Long,
    val bleVersion: Long,
    val batteryLevel: Int,
    val profileLoaded: Boolean
)
{
    companion object {

        fun fromMap(osInfo: Map<String, String>) : AuroraOsInfo {

            return AuroraOsInfo(
                version = osInfo["version"]?.toLong() ?: 0,
                bootstrapVersion = osInfo["bootstrapVersion"]?.toLong() ?: 0,
                bootloaderVersion = osInfo["bootloaderVersion"]?.toLong() ?: 0,
                bleVersion = osInfo["bleVersion"]?.toLong() ?: 0,
                batteryLevel = osInfo["batteryLevel"]?.replace("%","", true)?.toInt() ?: 0,
                profileLoaded = osInfo.containsKey("profile") && !osInfo["profile"].equals("NO", true)
            )
        }
    }
}*/

export class AuroraOsInfo {

    public version: number;

    public bootStrapVersion: number;

    public bootLoaderVersion: number;

    public bleVersion: number;

    public batteryLevel: number;
}