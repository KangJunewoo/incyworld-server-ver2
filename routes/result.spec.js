const req = require("supertest");
const { sequelize, Result } = require("../models");
const app = require("../app");
const util = require("../modules/util");
const resMessage = require("../modules/responseMessage");
const statusCode = require("../modules/statusCode");

const expectedDatas = [];
for (let i = 1; i <= 4; i++) {
    expectedDatas.push({
        id: i,
        imageUrl: `sampleImageUrl${i}`,
        videoUrl: `sampleVideoUrl${i}`,
        title: `sampleTitle${i}`,
        guide: `sampleGuide${i}`,
    });
}

beforeAll(async () => {
    await sequelize.sync();
    for (let data of expectedDatas) {
        await Result.create(data);
    }
});

describe("GET /result/:levelNum", () => {
    test("levelNum 1~4가 주어질 경우 정상json 응답하기", async () => {
        await req(app)
            .get("/result/1")
            .expect(
                statusCode.OK,
                util.success(
                    statusCode.OK,
                    resMessage.SUCCESS,
                    expectedDatas[0],
                ),
            );
        await req(app)
            .get("/result/2")
            .expect(
                statusCode.OK,
                util.success(
                    statusCode.OK,
                    resMessage.SUCCESS,
                    expectedDatas[1],
                ),
            );
        await req(app)
            .get("/result/3")
            .expect(
                statusCode.OK,
                util.success(
                    statusCode.OK,
                    resMessage.SUCCESS,
                    expectedDatas[2],
                ),
            );
        await req(app)
            .get("/result/4")
            .expect(
                statusCode.OK,
                util.success(
                    statusCode.OK,
                    resMessage.SUCCESS,
                    expectedDatas[3],
                ),
            );
    });

    test("levelNum 1~4가 아닌 값이 주어질 경우 에러json 응답하기", async () => {
        await req(app)
            .get("/result/0")
            .expect(
                statusCode.INVALID_VALUE,
                util.fail(statusCode.INVALID_VALUE, resMessage.INVALID_VALUE),
            );

        await req(app)
            .get("/result/5")
            .expect(
                statusCode.INVALID_VALUE,
                util.fail(statusCode.INVALID_VALUE, resMessage.INVALID_VALUE),
            );
    });
});

afterAll(async () => {
    await sequelize.sync({ force: true });
});
