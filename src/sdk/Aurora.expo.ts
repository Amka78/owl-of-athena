//#region Import Modules
import { AuroraOSInfo } from "./models";
import { EventEmitter } from "events";
import * as AuroraConstants from "./AuroraConstants";
import { ConnectorTypes } from "./AuroraConstants";
import { CommandResult, FileInfo, EventResponse } from "./AuroraTypes";
import { ReadCommandResult } from "./AuroraCmdReadFile";
//#endregion

class Aurora extends EventEmitter {
    public async connectBluetooth(
        timeoutMs = 20000
    ): Promise<AuroraOSInfo | never> {
        console.debug(`timeoutMs:${timeoutMs}`);

        return new AuroraOSInfo({
            batteryLevel: 100,
            bleVersion: 1.0,
            bootloaderVersion: 1.0,
            bootstrapVersion: 1.0,
            profile: "test",
            profileLoaded: true,
            version: 1.0,
        });
    }

    public async disconnectBluetooth(): Promise<unknown | never> {
        return undefined;
    }

    public async queueCmd<T>(
        commandStr: string,
        connectorType = AuroraConstants.ConnectorTypes.ANY,
        onCmdBegin?: (cmd: T) => void,
        onCmdEnd?: () => void
    ): Promise<void> {
        console.debug(`commandStr:${commandStr}`);
        console.debug(`connectorType:${connectorType}`);
        console.debug(`onCmdBegin:${onCmdBegin}`);
        console.debug(`onCmdEnd:${onCmdEnd}`);

        return;
    }

    public async readFile(
        srcPath: string,
        writeStream: boolean,
        compress: boolean,
        connectorType: ConnectorTypes = ConnectorTypes.ANY
    ): Promise<ReadCommandResult> {
        console.debug(`strPath:${srcPath}`);
        console.debug(`writeStream:${writeStream}`);
        console.debug(`compress:${compress}`);
        console.debug(`connectorType:${connectorType}`);

        return {
            error: false,
            output: "test",
        };
    }

    public async writeFile(
        destPath: string,
        dataOrReadStream: string,
        rename = false,
        osVersion = 3000,
        connectorType: ConnectorTypes = ConnectorTypes.ANY
    ): Promise<CommandResult<FileInfo>> {
        console.debug(`destPath:${destPath}`);
        console.debug(`dataOrReadStream:${dataOrReadStream}`);
        console.debug(`rename:${rename}`);
        console.debug(`osVersion:${osVersion}`);
        console.debug(`connectorType:${connectorType}`);

        return {};
    }

    public async getUnsyncedSessions(
        filter?: string,
        connector: ConnectorTypes = ConnectorTypes.ANY
    ): Promise<Array<FileInfo>> {
        console.debug(`filter:${filter}`);
        console.debug(`connector:${connector}`);
        return new Array(0);
    }

    public async enableEvents(
        enableEvent: AuroraConstants.EventIds[]
    ): Promise<CommandResult<EventResponse>> {
        console.debug(`enableEvent:${enableEvent}`);
        return {};
    }

    public async syncTime(): Promise<number> {
        return 100;
    }
}

export default new Aurora();
