import {
    ConnectionStates,
    ConnectionStatesToNames,
} from "../sdk/AuroraConstants";
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
    console.debug(
        `currenctConnectionState:${ConnectionStatesToNames[currentConnectionState]}`
    );
    if (
        currentConnectionState === ConnectionStates.DISCONNECTED &&
        followingConnectionState === ConnectionStates.IDLE
    ) {
        setConnect(ConnectionStates.CONNECTED);
    } else if (
        currentConnectionState === ConnectionStates.CONNECTED &&
        followingConnectionState === ConnectionStates.DISCONNECTED
    ) {
        setConnect(ConnectionStates.DISCONNECTED);
    }
}
