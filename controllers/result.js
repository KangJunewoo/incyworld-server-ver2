const resMessage = require("../modules/responseMessage");
const statusCode = require("../modules/statusCode");
const util = require("../modules/util");
const { Result } = require("../models");

const result = {
    /**
     * 레벨정보 조회
     * @summary 레벨정보 조회
     * @param 레벨 번호
     * @return 해당 레벨의 정보
     */
    getResult: async (req, res) => {
        const { levelNum } = req.params;
        if (levelNum == undefined) {
            return res
                .status(statusCode.BAD_REQUEST)
                .send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
        }
        try {
            if (levelNum > 0 && levelNum <= 4) {
                // step이 몇번인지 알아낸 이후에,
                const results = await Result.findOne({
                    where: {
                        id: levelNum,
                    },
                });

                return res
                    .status(statusCode.OK)
                    .send(
                        util.success(
                            statusCode.OK,
                            resMessage.SUCCESS,
                            results,
                        ),
                    );
            }
            return res
                .status(statusCode.BAD_REQUEST)
                .send(
                    util.fail(
                        statusCode.INVALID_VALUE,
                        resMessage.INVALID_VALUE,
                    ),
                );
        } catch (err) {
            console.error(err);
            return res
                .status(statusCode.INTERNAL_SERVER_ERROR)
                .send(
                    util.fail(
                        statusCode.INTERNAL_SERVER_ERROR,
                        resMessage.DB_ERROR,
                    ),
                );
        }
    },
};

module.exports = result;
