import { ConnectionStates } from "../sdk/AuroraConstants";

/**
 * Processing of Aurora connection change.
 *
 * @export
 * @param {ConnectionStates} followingConnectionState
 * @param {ConnectionStates} currentConnectionState
 * @param {React.Dispatch<React.SetStateAction<ConnectionStates>>} setConnect
 */
export function onConnectionChange(
    followingConnectionState: ConnectionStates,
    currentConnectionState: ConnectionStates,
    setConnect: React.Dispatch<React.SetStateAction<ConnectionStates>>
): void {
    if (
        currentConnectionState === ConnectionStates.DISCONNECTED &&
        followingConnectionState === ConnectionStates.IDLE
    ) {
        setConnect(ConnectionStates.CONNECTED);
    } else if (followingConnectionState === ConnectionStates.DISCONNECTED) {
        setConnect(ConnectionStates.DISCONNECTED);
    }
}
