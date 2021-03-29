global.fetch = require("jest-fetch-mock");
jest.mock("node-fetch", () => global.fetch);
