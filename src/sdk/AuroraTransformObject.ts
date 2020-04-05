import Stream from "stream";
import Flat from "flat";
import { parseValueString, camelCaseObjectKeys } from "./util";

export default class AuroraTransformObject extends Stream.Transform {
    private leftoverData: string;

    private transformedObject: any;
    constructor() {
        super({ objectMode: true, encoding: undefined });

        this.leftoverData = "";
        this.transformedObject = {};
    }

    _transform(
        chunk: string,
        _encoding: string,
        done: Stream.TransformCallback
    ): void {
        chunk = chunk.toString();

        if (this.leftoverData) {
            chunk = this.leftoverData + chunk;
            this.leftoverData = "";
        }

        let lines = chunk.split("\n");

        this.leftoverData = lines.pop()!;

        lines = lines.map(line => line.trim()).filter(String);

        for (const line of lines) {
            this.processLine(line);
        }

        done();
    }

    _flush(done: Stream.TransformCallback): void {
        this.leftoverData = this.leftoverData.trim();

        if (this.leftoverData) {
            this.processLine(this.leftoverData);
        }

        this.push(camelCaseObjectKeys(Flat.unflatten(this.transformedObject)));

        done();
    }

    private processLine(line: string): void {
        const key_value = line.split(":");

        if (key_value.length >= 2) {
            const key = key_value.shift()!.trim();

            this.transformedObject[key] = parseValueString(key_value.join(":"));
        }
    }
}
