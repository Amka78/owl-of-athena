//#region Import Modules
import { ConnectionStates } from "../sdk/AuroraConstants";
//#endregion

//#region Service
/**
 * Processing of Aurora connection change.
 *
 * @export
 * @param {ConnectionStates} followingConnectionState
 * @param {ConnectionStates} currentConnectionState
 * @param {React.Dispatch<React.SetStateAction<ConnectionStates>>} setConnect
 */
export const onConnectionChange = (
    followingConnectionState: ConnectionStates,
    currentConnectionState: ConnectionStates,
    connnectionChangeCallback: (state: ConnectionStates) => void
): void => {
    if (
        currentConnectionState === ConnectionStates.DISCONNECTED &&
        followingConnectionState === ConnectionStates.IDLE
    ) {
        connnectionChangeCallback(ConnectionStates.CONNECTED);
    } else if (followingConnectionState === ConnectionStates.DISCONNECTED) {
        connnectionChangeCallback(ConnectionStates.DISCONNECTED);
    }
};
//#endregion
