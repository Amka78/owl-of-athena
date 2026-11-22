// Vite alias target for node の "stream" モジュール（browser では外部化される）。
// AuroraTransformBinary が extends Transform するため import 成立が必須。
// story レンダーでは transform パイプラインは実行されないため、最小限の
// API サーフェスで十分。
export type TransformCallback = (error?: Error | null, data?: unknown) => void;

export class Transform {
    constructor(_options?: unknown) {
        // noop
    }
    _transform(_chunk: unknown, _encoding: string, done?: TransformCallback): void {
        done?.();
    }
    push(_data: unknown): boolean {
        return true;
    }
    write(_chunk: unknown, ..._args: unknown[]): boolean {
        return true;
    }
    end(..._args: unknown[]): this {
        return this;
    }
    on(_event: string, _listener?: (...args: unknown[]) => void): this {
        return this;
    }
    once(_event: string, _listener?: (...args: unknown[]) => void): this {
        return this;
    }
    emit(..._args: unknown[]): boolean {
        return true;
    }
    pipe<T>(destination: T): T {
        return destination;
    }
    unpipe(): this {
        return this;
    }
    resume(): this {
        return this;
    }
    pause(): this {
        return this;
    }
    setEncoding(_encoding: string): this {
        return this;
    }
    removeListener(_event: string, _listener?: (...args: unknown[]) => void): this {
        return this;
    }
    [Symbol.toStringTag] = "Transform";
}

export default Transform;