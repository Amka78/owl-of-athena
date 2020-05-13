import split from "split";
import { ConnectorTypes } from "./AuroraConstants";
import { AuroraProfile } from "./AuroraTypes";
import { Aurora } from "./Aurora";

const AuroraCmdGetProfiles = async function (
    this: Aurora,
    connectorType: ConnectorTypes = ConnectorTypes.ANY
): Promise<unknown> {
    const profileListReadResp: any = await this.readFile(
        "profiles/_profiles.list",
        split(),
        true,
        connectorType
    );

    const profilesInList = profileListReadResp.output
        .filter(String)
        .map((prof: string, index: number) => {
            const profile: AuroraProfile = {};
            const profParts = prof.trim().split(":");

            if (profParts.length == 3) {
                profile.active = false;
                profile.name = profParts[1];
                profile.id = profParts[2];
            } else {
                profile.active = true;
                profile.name = profParts[0];
                profile.id = profParts[1];
            }

            profile.key = `${index}_${profile.id}_${profile.name}`;

            return profile;
        });

    const { response } = await this.queueCmd(
        "sd-dir-read profiles 1 *.prof",
        connectorType
    );
    const profiles = [];

    for (const profile of response) {
        try {
            const readCmdWithResponse = await this.readFile(
                `profiles/${profile.name}`,
                false,
                false,
                connectorType
            );

            const p = {
                active: false,
                content: readCmdWithResponse.output,
                key: "_" + profile.name,
            };

            Object.assign(
                p,
                profile,
                profilesInList.find(
                    (prof: AuroraProfile) => prof.name == profile.name
                )
            );

            profiles.push(p);
        } catch (error) {
            return;
        }
    }

    return profiles.sort((a, b) =>
        a.key > b.key ? 1 : a.key < b.key ? -1 : 0
    );
};

export default AuroraCmdGetProfiles;
