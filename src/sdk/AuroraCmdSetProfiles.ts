import pick from "lodash/pick";
import { ConnectorTypes } from "./AuroraConstants";
import { AuroraProfile } from "./AuroraTypes";

export async function AuroraCmdSetProfiles(
    newProfiles: Array<AuroraProfile>,
    connectorType: ConnectorTypes = ConnectorTypes.ANY
): Promise<Array<AuroraProfile>> {
    // @ts-ignore
    await this.queueCmd("sd-dir-del profiles");
    // @ts-ignore
    await this.queueCmd("sd-dir-create profiles");

    const profiles = [];
    const profileList = [];

    for (let i = 0; i < newProfiles.length; i++) {
        // @ts-ignore
        const profWriteCmd = await this.writeFile(
            `profiles/${newProfiles[i].name}`,
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

    // @ts-ignore
    await this.writeFile(
        "profiles/_profiles.list",
        profileList.join("\r\n"),
        false,
        connectorType
    );

    return profiles;
}
