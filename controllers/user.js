// const userModel = require('../models/user');
const {sequelize, Op, fn} = require('sequelize');
const resMessage = require('../modules/responseMessage');
const statusCode = require('../modules/statusCode');
const util = require('../modules/util');
const calculateScore = require('../modules/calculateScore');
const getResultId = require('../modules/getResultId');
const { User, Result } = require('../models');

const user = {
  /**
   * 점수 채점 후 user 생성
   * @summary user 생성
   * @param birthYear, answers
   * @return 새로 생성된 user
   */
  createUser: async (req, res, next) => {
    const { birthYear, answers } = req.body;
    if (birthYear === undefined || answers === undefined) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
    }

    const score = calculateScore(answers); // 점수 채점 후
    const resultId = getResultId(score); // 어느 결과그룹에 속하는지 조회

    try {
      const result = await Result.findOne({ where: { id: resultId } });

      const newUser = await User.create({
        birthYear: birthYear,
        score: score,
      });

      await result.addUser(newUser);

      req.user = newUser; // user값을 넘겨준 후
      next(); // 다음 컨트롤러 호출

    } catch (err) {
      console.error(err);
      return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.DB_ERROR));
    }
  },

  getScoreRate: async (req, res) => {
    try {
      if(req.user == undefined){
        return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
      }
      
      // 생년월일 같은 사람들 몇명있는지
      const sameBirthCount = await User.findOne({
        attributes: [[fn('COUNT', '*'), 'count']],
        where: {
          birthYear: req.user.birthYear,
        },
      });
      

      // 해당 사용자 점수 이상인 사람 수 조회
      const userScoreCount = await User.findOne({
        attributes: [[fn('COUNT', '*'), 'count']],
        where: {
          score: { [Op.gte]: req.user.score },
        },
      });

      const scoreRate = Math.round((userScoreCount.dataValues.count / sameBirthCount.dataValues.count) * 100);
      const data = {
        'score' : req.user.score * 10, // 100점 만점이므로 10 곱해서 리턴.
        'scoreRate' : scoreRate
      }
      return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SUCCESS, data));
    } catch (err) {
      console.error(err);
      return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, resMessage.DB_ERROR));
    }
  },
};

module.exports = user;
