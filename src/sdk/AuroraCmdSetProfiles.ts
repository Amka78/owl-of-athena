import pick from "lodash/pick";
import { ConnectorTypes } from "./AuroraConstants";
import { AuroraProfile } from "./AuroraTypes";
import { Aurora } from "./Aurora";

const AuroraCmdSetProfiles = async function AuroraCmdSetProfiles(
    this: Aurora,
    newProfiles: Array<AuroraProfile>,
    connectorType: ConnectorTypes = ConnectorTypes.ANY
): Promise<Array<AuroraProfile>> {
    await this.queueCmd("sd-dir-del profiles");
    await this.queueCmd("sd-dir-create profiles");

    const profiles = [];
    const profileList = [];

    for (let i = 0; i < newProfiles.length; i++) {
        const profWriteCmd = await this.writeFile(
            `profiles/${newProfiles[i].name}`,
            // @ts-ignore
            newProfiles[i].content,
            true,
            connectorType
        );

        const profile: AuroraProfile = pick(newProfiles[i], [
            "id",
            "active",
            "content"
        ]);

        profile.name = profWriteCmd.response.file.slice(9);
        profile.key = i + profile.id! + profile.name;

        //add leading ':' to mark profile as inactive
        profileList.push(
            `${profile.active ? "" : ":"}${profile.name}:${profile.id}`
        );

        profiles.push(profile);
    }

    await this.writeFile(
        "profiles/_profiles.list",
        profileList.join("\r\n"),
        false,
        connectorType
    );

    return profiles;
};
export default AuroraCmdSetProfiles;
