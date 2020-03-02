import split from "split";
import { ConnectorTypes } from "./AuroraConstants";
import { AuroraProfile } from "./AuroraTypes";

const AuroraCmdGetProfiles = async function(
    connectorType: ConnectorTypes = ConnectorTypes.ANY
): Promise<unknown> {
    // @ts-ignore
    const profileListReadResp = await this.readFile(
        "profiles/_profiles.list",
        split(),
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

    // @ts-ignore
    const { response } = await this.queueCmd(
        "sd-dir-read profiles 1 *.prof",
        connectorType
    );
    const profiles = [];

    for (const profile of response) {
        try {
            // @ts-ignore
            const readCmdWithResponse = await this.readFile(
                `profiles/${profile.name}`,
                false,
                connectorType
            );

            const p = {
                active: false,
                content: readCmdWithResponse.output,
                key: "_" + profile.name
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
