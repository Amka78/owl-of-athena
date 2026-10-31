//#region Function
/**
 * 端末のバージョンは 10402 のように major*10000 + minor*100 + build で表される。
 * 端末のバージョンが不明（0）のときは更新を促さない。
 */
export const shouldUpdateFirmware = (deviceVersion: number, latestVersion: number): boolean => {
    if (deviceVersion <= 0) return false;
    if (latestVersion <= 0) return false;
    return latestVersion > deviceVersion;
};
//#endregion
