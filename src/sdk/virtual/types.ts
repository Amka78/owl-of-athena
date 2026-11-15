/** Aurora クラスが接続層に対して要求する公開インターフェース。 */
export interface AuroraBluetoothTransport {
    isConnected(): boolean;
    isConnecting(): boolean;
    connect(timeoutMs?: number): Promise<unknown>;
    disconnect(): Promise<unknown>;
    // Aurora.ts の queueCmd が型付けされた then コールバックを直列に受けるため any に合わせる
    writeCmd(cmd: string): Promise<any>;
    writeCmdInput(data: Buffer): Promise<unknown>;
    on(event: string | symbol, listener: (...args: any[]) => void): this;
    once(event: string | symbol, listener: (...args: any[]) => void): this;
    off(event: string | symbol, listener: (...args: any[]) => void): this;
    removeListener(event: string | symbol, listener: (...args: any[]) => void): this;
}
