require("jest"); // Intellisense를 위함.
require("mysql2/node_modules/iconv-lite").encodingExists("utf8mb4"); // jest 테스트 시 인코딩 에러 방지를 위함.
jest.mock("../models");

const { createUser, getScoreRate } = require("../controllers/user");
const resMessage = require("../modules/responseMessage");
const statusCode = require("../modules/statusCode");
const util = require("../modules/util");
const { User, Result } = require("../models");

const res = {
    status: jest.fn(() => res),
    send: jest.fn(),
};

const next = jest.fn();

describe("createUser", () => {
    test("9~10개 맞춘 경우 다음 컨트롤러를 호출해야 함.", async () => {
        const req = {
            body: {
                birthYear: 1998,
                answers: [1, 4, 2, 3, 2, 2, 3, 4, 1, 4],
            },
        };
        Result.findOne.mockReturnValue(
            Promise.resolve({
                addUser(user) {
                    return Promise.resolve(true);
                },
            }),
        ); // Result.findOne으로 찾아낸 result는 addUser를 불러낼 수 있어야 함.

        User.create.mockReturnValue({
            birthYear: expect.anything(Number),
            score: expect.anything(Number),
        }); // 유저를 리턴할 수 있어야 함.

        await createUser(req, res, next);
        expect(req).toHaveProperty("user"); // req에 user와 levelNum이 달리고
        expect(req).toHaveProperty("levelNum");
        expect(next).toBeCalled(); // 무사히 next까지 가기를.
    });

    test("6~8개 맞춘 경우 다음 컨트롤러를 호출해야 함.", async () => {
        const req = {
            body: {
                birthYear: 1998,
                answers: [1, 4, 2, 3, 2, 2, 3, 1, 4, 1],
            },
        };
        Result.findOne.mockReturnValue(
            Promise.resolve({
                addUser(user) {
                    return Promise.resolve(true);
                },
            }),
        ); // Result.findOne으로 찾아낸 result는 addUser를 불러낼 수 있어야 함.

        User.create.mockReturnValue({
            birthYear: expect.anything(Number),
            score: expect.anything(Number),
        }); // 유저를 리턴할 수 있어야 함.

        await createUser(req, res, next);
        expect(req).toHaveProperty("user"); // req에 user와 levelNum이 달리고
        expect(req).toHaveProperty("levelNum");
        expect(next).toBeCalled(); // 무사히 next까지 가기를.
    });

    test("3~5개 맞춘 경우 다음 컨트롤러를 호출해야 함.", async () => {
        const req = {
            body: {
                birthYear: 1998,
                answers: [1, 4, 2, 1, 1, 1, 1, 1, 1, 1],
            },
        };
        Result.findOne.mockReturnValue(
            Promise.resolve({
                addUser(user) {
                    return Promise.resolve(true);
                },
            }),
        ); // Result.findOne으로 찾아낸 result는 addUser를 불러낼 수 있어야 함.

        User.create.mockReturnValue({
            birthYear: expect.anything(Number),
            score: expect.anything(Number),
        }); // 유저를 리턴할 수 있어야 함.

        await createUser(req, res, next);
        expect(req).toHaveProperty("user"); // req에 user와 levelNum이 달리고
        expect(req).toHaveProperty("levelNum");
        expect(next).toBeCalled(); // 무사히 next까지 가기를.
    });

    test("2개 이하로 맞춘 경우 다음 컨트롤러를 호출해야 함.", async () => {
        const req = {
            body: {
                birthYear: 1998,
                answers: [2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
            },
        };
        Result.findOne.mockReturnValue(
            Promise.resolve({
                addUser(user) {
                    return Promise.resolve(true);
                },
            }),
        ); // Result.findOne으로 찾아낸 result는 addUser를 불러낼 수 있어야 함.

        User.create.mockReturnValue({
            birthYear: expect.anything(Number),
            score: expect.anything(Number),
        }); // 유저를 리턴할 수 있어야 함.

        await createUser(req, res, next);
        expect(req).toHaveProperty("user"); // req에 user와 levelNum이 달리고
        expect(req).toHaveProperty("levelNum");
        expect(next).toBeCalled(); // 무사히 next까지 가기를.
    });

    test("Result 조회 중 에러가 발생한 경우 500 json을 띄워야 함.", async () => {
        const req = {
            body: {
                birthYear: 1998,
                answers: [1, 2, 3, 2, 1, 2, 3, 2, 1, 2],
            },
        };
        Result.findOne.mockReturnValue(Promise.reject()); // Result.findOne으로 찾아낸 result는 addUser를 불러낼 수 있어야 함.

        User.create.mockReturnValue({
            birthYear: expect.anything(Number),
            score: expect.anything(Number),
        }); // 유저를 리턴할 수 있어야 함.

        await createUser(req, res, next);
        expect(res.status).toBeCalledWith(statusCode.INTERNAL_SERVER_ERROR);
        expect(res.send).toBeCalledWith(
            util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.DB_ERROR),
        );
    });

    test("User 생성 중 에러가 발생한 경우 500 json을 띄워야 함.", async () => {
        const req = {
            body: {
                birthYear: 1998,
                answers: [1, 2, 3, 2, 1, 2, 3, 2, 1, 2],
            },
        };
        Result.findOne.mockReturnValue(
            Promise.resolve({
                addUser(user) {
                    return Promise.resolve(true);
                },
            }),
        ); // Result.findOne으로 찾아낸 result는 addUser를 불러낼 수 있어야 함.

        User.create.mockReturnValue(Promise.reject()); // 유저를 리턴할 수 있어야 함.

        await createUser(req, res, next);
        expect(res.status).toBeCalledWith(statusCode.INTERNAL_SERVER_ERROR);
        expect(res.send).toBeCalledWith(
            util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.DB_ERROR),
        );
    });

    test("addUser 함수 실행 중 에러가 발생한 경우 500 json을 띄워야 함.", async () => {
        const req = {
            body: {
                birthYear: 1998,
                answers: [1, 2, 3, 2, 1, 2, 3, 2, 1, 2],
            },
        };
        Result.findOne.mockReturnValue(
            Promise.resolve({
                addUser(user) {
                    return Promise.reject();
                },
            }),
        ); // Result.findOne으로 찾아낸 result는 addUser를 불러낼 수 있어야 함.

        User.create.mockReturnValue({
            birthYear: expect.anything(Number),
            score: expect.anything(Number),
        }); // 유저를 리턴할 수 있어야 함.

        await createUser(req, res, next);
        expect(res.status).toBeCalledWith(statusCode.INTERNAL_SERVER_ERROR);
        expect(res.send).toBeCalledWith(
            util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.DB_ERROR),
        );
    });

    // 테스트의 중요성이 조금 더 느껴진다.
    // 테스트를 작성하면서 들어올 수 있는 수많은 입력의 경우의 수를 고려하게 되는구나.
    test("birthYear가 undefined인 경우 400 에러json을 리턴해야 함.", async () => {
        const req = {
            body: {
                birthYear: undefined,
                answers: [1, 2, 3, 2, 1, 2, 3, 2, 1, 2],
            },
        };

        await createUser(req, res, next);
        expect(res.status).toBeCalledWith(statusCode.BAD_REQUEST); // req에 user와 levelNum이 달리고
        expect(res.send).toBeCalledWith(
            util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE),
        );
    });

    test("answers가 undefined인 경우 400 에러json을 리턴해야 함.", async () => {
        const req = {
            body: {
                birthYear: 1998,
                answers: undefined,
            },
        };

        await createUser(req, res, next);
        expect(res.status).toBeCalledWith(statusCode.BAD_REQUEST); // req에 user와 levelNum이 달리고
        expect(res.send).toBeCalledWith(
            util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE),
        );
    });
});

describe("getScoreRate", () => {
    test("정상적인 user와 levelNum이 들어왔을 경우, data를 리턴해야 함.", async () => {
        const req = {
            user: { score: 8, birthYear: 1998 },
            levelNum: 3,
        };
        const expectedData = {
            score: expect.any(Number),
            scoreRate: expect.any(Number),
            levelNum: expect.any(Number),
        };
        User.findOne.mockReturnValue({
            dataValues: { count: expect.any(Number) },
        }); // 사람 수를 리턴해야 함.
        await getScoreRate(req, res);
        expect(res.status).toBeCalledWith(statusCode.CREATED);
        expect(res.send).toBeCalledWith(
            util.success(statusCode.CREATED, resMessage.SUCCESS, expectedData),
        );
    });

    test("req.user가 존재하지 않을 경우 400 json을 리턴해야 함", async () => {
        const req = {
            user: undefined,
            levelNum: 3,
        };
        await getScoreRate(req, res);
        expect(res.status).toBeCalledWith(statusCode.BAD_REQUEST);
        expect(res.send).toBeCalledWith(
            util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE),
        );
    });

    test("req.levelNum이 존재하지 않을 경우 400 json을 리턴해야 함", async () => {
        const req = {
            user: { score: 8, birthYear: 1998 },
            levelNum: undefined,
        };
        await getScoreRate(req, res);
        expect(res.status).toBeCalledWith(statusCode.BAD_REQUEST);
        expect(res.send).toBeCalledWith(
            util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE),
        );
    });

    test("서버 에러가 발생한 경우, 500 json을 리턴해야 함.", async () => {
        const req = {
            user: { score: 8, birthYear: 1998 },
            levelNum: 3,
        };
        User.findOne.mockReturnValue(Promise.reject()); // 에러발생!
        await getScoreRate(req, res);
        expect(res.status).toBeCalledWith(statusCode.INTERNAL_SERVER_ERROR);
        expect(res.send).toBeCalledWith(
            util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.DB_ERROR),
        );
    });
});
