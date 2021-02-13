const moment = require('moment');
const Op = require('sequelize').Op;
const {Log} = require('../models');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const gmail = require('../config/gmail');

module.exports = {
  sendTrafficEmail:async()=>{
    const landingPageToday = await Log.count({
      where:{
        type:0,
        createdAt:{
          [Op.gt]: moment().format('YYYY-MM-DD 00:00'),
          [Op.lt]: moment().format('YYYY-MM-DD 23:59')
        }
      }
    });
    const resultPageToday = await Log.count({
      where:{
        type:1,
        createdAt:{
          [Op.gt]: moment().format('YYYY-MM-DD 00:00'),
          [Op.lt]: moment().format('YYYY-MM-DD 23:59')
        }
      }
    });
    const landingPageTotal = await Log.count({
      where:{
        type:0
      }
    });
    const resultPageTotal = await Log.count({
      where:{
        type:1
      }
    });
    
    let emailTemplate;
    ejs.renderFile('./views/mail.ejs',{
      landingPageToday,
      resultPageToday,
      landingPageTotal,
      resultPageTotal
    }, (err, data)=>{
      if(err) console.error(err);
      emailTemplate = data;
    });

    let transporter = nodemailer.createTransport({
      service:'gmail',
      auth:{
        user:gmail.id,
        pass:gmail.pw
      }
    });

    let mailOptions = {
      from:gmail.id,
      to:'brianjune@naver.com',
      subject: `[인싸월] ${moment().format('YYYY-MM-DD')} 트래픽 알림 😎`,
      html:emailTemplate
    };

    try{
      const info = await transporter.sendMail(mailOptions);
      console.log('email sent : ' + info.response);
      transporter.close();
    } catch(err){
      console.error(err);
    }
    //sendSlackMessage(`*** ${moment().format('YYYY-MM-DD')} 트래픽 👻 ***\n - main : ${mainAccess} (누적 ${mainAccessTotal})\n - test : ${testAccess} (누적 ${testAccessTotal})`);
  }
}