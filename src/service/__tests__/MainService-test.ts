import { onConnectionChange } from "../MainService";
import { ConnectionStates } from "../../sdk/AuroraConstants";

describe("MainService-test", () => {
    it.each([
        [
            ConnectionStates.IDLE,
            ConnectionStates.DISCONNECTED,
            ConnectionStates.CONNECTED,
        ],
        [
            ConnectionStates.DISCONNECTED,
            ConnectionStates.CONNECTED,
            ConnectionStates.DISCONNECTED,
        ],
    ])(
        "The connection state should change to Connected or Dicconnected based on the content of ConnectionStates.",
        (
            followingConnectionState: ConnectionStates,
            currentConnectionState: ConnectionStates,
            resultConnectedState: ConnectionStates
        ) => {
            const setState = jest.fn();

            onConnectionChange(
                followingConnectionState,
                currentConnectionState,
                setState
            );

            expect(setState.mock.calls.length).toBe(1);
            expect(setState.mock.calls[0][0]).toBe(resultConnectedState);
        }
    );

    it.each([
        [ConnectionStates.IDLE, ConnectionStates.CONNECTED],
        [ConnectionStates.BUSY, ConnectionStates.CONNECTED],
        [ConnectionStates.BUSY, ConnectionStates.DISCONNECTED],
        [ConnectionStates.CONNECTING, ConnectionStates.DISCONNECTED],
    ])(
        "If the ConnectionState is not related to the connection state, the connection state does not change.",
        (
            followingConnectionState: ConnectionStates,
            currentConnectionState: ConnectionStates
        ) => {
            const setState = jest.fn();

            onConnectionChange(
                followingConnectionState,
                currentConnectionState,
                setState
            );

            expect(setState.mock.calls.length).toBe(0);
        }
    );
});
