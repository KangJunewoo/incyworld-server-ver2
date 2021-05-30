require("jest"); // Intellisense를 위함.
require("mysql2/node_modules/iconv-lite").encodingExists("utf8mb4"); // jest 테스트 시 인코딩 에러 방지를 위함.
jest.mock("../models/result");

const _ = require("lodash");
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

    // QUESTION : 왜 테스트 안에서 반복문을 돌리면 첫번째것 기준으로 실행이 될까?
    // QUESTION : 왜 describe문 안에 req 선언해놓고 test 안에서 req.params.id만 바꿔가면서 테스트하면 안되는 것일까?
    test("testNum 1이 주어진다면 정상json 반환", async () => {
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
    });

    test("testNum 4가 주어진다면 정상json 반환", async () => {
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
                levelNum: 4,
            },
        };

        await getResult(req, res);
        expect(res.status).toBeCalledWith(statusCode.OK);
        expect(res.send).toBeCalledWith(
            util.success(statusCode.OK, resMessage.SUCCESS, expectedResults),
        );
    });
    test("testNum 0이 주어진다면 에러json 반환", async () => {
        const req = {
            params: {
                levelNum: 0,
            },
        };

        await getResult(req, res);
        expect(res.status).toBeCalledWith(statusCode.INVALID_VALUE);
        expect(res.send).toBeCalledWith(
            util.fail(statusCode.INVALID_VALUE, resMessage.INVALID_VALUE),
        );
    });

    test("testNum 5가 주어진다면 에러json 반환", async () => {
        const req = {
            params: {
                levelNum: 5,
            },
        };

        await getResult(req, res);
        expect(res.status).toBeCalledWith(statusCode.INVALID_VALUE);
        expect(res.send).toBeCalledWith(
            util.fail(statusCode.INVALID_VALUE, resMessage.INVALID_VALUE),
        );
    });

    test("testNum이 undefined인 경우 에러json 반환", async () => {
        const req = {
            params: {
                levelNum: undefined,
            },
        };

        await getResult(req, res);
        expect(res.status).toBeCalledWith(statusCode.INVALID_VALUE);
        expect(res.send).toBeCalledWith(
            util.fail(statusCode.INVALID_VALUE, resMessage.INVALID_VALUE),
        );
    });

    test("testNum이 null인 경우 에러json 반환", async () => {
        const req = {
            params: {
                levelNum: null,
            },
        };

        await getResult(req, res);
        expect(res.status).toBeCalledWith(statusCode.INVALID_VALUE);
        expect(res.send).toBeCalledWith(
            util.fail(statusCode.INVALID_VALUE, resMessage.INVALID_VALUE),
        );
    });
});
