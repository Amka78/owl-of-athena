import fs from "fs";
import path from "path";
import readline from "readline";
import AuroraCmdResponseParser from "../../AuroraCmdResponseParser";

import mockObject from "../../testData/CmdResponseObjectOutput";
import mockTable from "../../testData/CmdResponseTableOutput";
import mockTableCondensed from "../../testData/CmdResponseTableCondensedOutput";
describe("AuroraCmdResponseParserTest", () => {
    test("Testing response line parsing (success cases)...", () => {
        const responseTypes = [
            {
                inputFile: "CmdResponseObjectInput.mock",
                outputObject: mockObject,
                name: "Object",
                parseAs: "detect"
            },
            {
                inputFile: "CmdResponseTableInput.mock",
                outputObject: mockTable,
                name: "Table",
                parseAs: "detect"
            },
            {
                inputFile: "CmdResponseTableCondensedInput.mock",
                outputObject: mockTableCondensed,
                name: "Table (condensed)",
                parseAs: "table"
            }
        ];

        const testPromises = responseTypes.map(responseType => {
            return new Promise(resolve => {
                const lineReader = readline.createInterface({
                    input: fs.createReadStream(
                        path.join(__dirname, responseType.inputFile)
                    )
                });

                const parser = new AuroraCmdResponseParser();

                if (responseType.parseAs == "object") {
                    lineReader.on("line", line => parser.parseObject(line));
                } else if (responseType.parseAs == "table") {
                    lineReader.on("line", line => parser.parseTable(line));
                } else {
                    lineReader.on("line", line => parser.parseDetect(line));
                }

                lineReader.on("close", () => {
                    expect(parser.getResponse()).toEqual(
                        responseType.outputObject
                    );

                    resolve();
                });
            });
        });

        Promise.all(testPromises);
    });
});
