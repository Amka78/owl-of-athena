import Stream from "stream";
import { Parser } from "binary-parser";
import { DataTypes } from "./AuroraConstants";
type DataTypesString =
    | "int8"
    | "uint16le"
    | "int16le"
    | "floatle"
    | "uint32le"
    | "int32le"
    | "uint8";

type ParseTypeLength = 2 | 4 | 1;
export default class AuroraTransformBinary extends Stream.Transform {
    private parseType: unknown;
    private parseTypeLength: number;
    private parser: Parser;
    private leftoverBuffer: unknown;
    private hasData: boolean;
    constructor(dataType = DataTypes.UINT8) {
        super({ encoding: undefined });

        this.parseType = this.getParseTypeFromDataType(dataType);
        this.parseTypeLength = this.getParseTypeLengthFromDataType(dataType);

        this.parser = new Parser();

        this.leftoverBuffer = null;
        this.hasData = false;

        this.parser.array("values", {
            type: this.parseType,
            readUntil: "eof",

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter: (values: any) => values.join(",")
        });
    }

    transform(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        respChunk: any,
        _encoding: string,
        done: Stream.TransformCallback
    ): void {
        if (!respChunk.length) {
            done();
            return;
        }

        if (Buffer.isBuffer(this.leftoverBuffer)) {
            respChunk = Buffer.concat(
                [this.leftoverBuffer, respChunk],
                this.leftoverBuffer.length + respChunk.length
            );
            this.leftoverBuffer = null;
        }

        if (respChunk.length < this.parseTypeLength) {
            this.leftoverBuffer = respChunk;
            done();
            return;
        }

        const numBytesLeftover = respChunk.length % this.parseTypeLength;

        let parsedChunk;

        if (numBytesLeftover) {
            parsedChunk = this.parser.parse(
                respChunk.slice(0, -numBytesLeftover)
            );

            this.leftoverBuffer = respChunk.slice(-numBytesLeftover);
        } else {
            parsedChunk = this.parser.parse(respChunk);
        }

        this.push((this.hasData ? "," : "") + parsedChunk.values);

        this.hasData = true;

        done();
    }

    _flush(done: Stream.TransformCallback): void {
        if (this.leftoverBuffer) {
            console.log("Unparsed binary buffer: ", this.leftoverBuffer);
        }

        this.hasData = false;

        done();
    }

    private getParseTypeFromDataType(dataType: DataTypes): DataTypesString {
        switch (dataType) {
            case DataTypes.INT8:
                return "int8";

            case DataTypes.UINT16:
                return "uint16le";

            case DataTypes.INT16:
                return "int16le";

            case DataTypes.FLOAT:
                return "floatle";

            case DataTypes.UINT32:
            case DataTypes.STR:
            case DataTypes.PTR:
                return "uint32le";

            case DataTypes.INT32:
                return "int32le";

            case DataTypes.UINT8:
            case DataTypes.CHAR:
            default:
                return "uint8";
        }
    }

    private getParseTypeLengthFromDataType(
        dataType: DataTypes
    ): ParseTypeLength {
        switch (dataType) {
            case DataTypes.UINT16:
            case DataTypes.INT16:
                return 2;

            case DataTypes.UINT32:
            case DataTypes.FLOAT:
            case DataTypes.STR:
            case DataTypes.PTR:
            case DataTypes.INT32:
                return 4;

            case DataTypes.UINT8:
            case DataTypes.CHAR:
            case DataTypes.INT8:
            default:
                return 1;
        }
    }
}
