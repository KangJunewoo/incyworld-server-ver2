require("jest"); // Intellisense를 위함.
require("mysql2/node_modules/iconv-lite").encodingExists("utf8mb4"); // jest 테스트 시 인코딩 에러 방지를 위함.
jest.mock("../models/result");

const { getResult } = require("../controllers/result");
const resMessage = require("../modules/responseMessage");
const statusCode = require("../modules/statusCode");
const util = require("../modules/util");
const { Result } = require("../models");
// npm i -D @types/jest 해야 Intellisense 정상작동
// 출처 : https://github.com/jest-community/vscode-jest/issues/440

describe("getResult", () => {
    const res = {
        status: jest.fn(() => res),
        send: jest.fn(),
    };
    test("1~4 사이의 levelNum이 주어진다면 정상json 반환", async () => {
        const expectedResults = {
            id: expect.any(Number),
            imageUrl: expect.any(String),
            videoUrl: expect.any(String),
            title: expect.any(String),
            guide: expect.any(String),
        };

        Result.findOne.mockReturnValue(expectedResults);
        const req = {
            params: {
                levelNum: 1,
            },
        };
        await getResult(req, res);
        expect(res.status).toBeCalledWith(statusCode.OK);
        expect(res.send).toBeCalledWith(
            util.success(statusCode.OK, resMessage.SUCCESS, expectedResults),
        );
        // expect(res.send).toHaveProperty("data.videoUrl");
        // expect(res.send).toHaveProperty("data.imageUrl");
        // expect(res.send).toHaveProperty("data.title");
        // expect(res.send).toHaveProperty("data.guide");
    });
    // test("1~4 사이가 아닌 levelNum이 주어진다면 404 json 반환", () => {});
    // test("levelNum이 주어지지 않는다면 400 json 반환", () => {});
});
