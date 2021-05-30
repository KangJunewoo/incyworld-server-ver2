const moment = require("moment");
const Op = require("sequelize").Op;
const { User } = require("../models");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const email = require("../config/email");

module.exports = {
    sendTrafficEmail: async () => {
        const resultPageToday = await User.count({
            where: {
                createdAt: {
                    [Op.gt]: moment().format("YYYY-MM-DD 00:00"),
                    [Op.lt]: moment().format("YYYY-MM-DD 23:59"),
                },
            },
        });
        const resultPageTotal = await User.count({});

        // const landingPageToday = await Log.count({
        //   where:{
        //     type:0,
        //     createdAt:{
        //       [Op.gt]: moment().format('YYYY-MM-DD 00:00'),
        //       [Op.lt]: moment().format('YYYY-MM-DD 23:59')
        //     }
        //   }
        // });
        // const resultPageToday = await Log.count({
        //   where:{
        //     type:1,
        //     createdAt:{
        //       [Op.gt]: moment().format('YYYY-MM-DD 00:00'),
        //       [Op.lt]: moment().format('YYYY-MM-DD 23:59')
        //     }
        //   }
        // });
        // const landingPageTotal = await Log.count({
        //   where:{
        //     type:0
        //   }
        // });
        // const resultPageTotal = await Log.count({
        //   where:{
        //     type:1
        //   }
        // });

        let emailTemplate;
        ejs.renderFile(
            "./views/mail.ejs",
            {
                resultPageToday,
                resultPageTotal,
            },
            (err, data) => {
                if (err) console.error(err);
                emailTemplate = data;
            },
        );

        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: email.from.id,
                pass: email.from.pw,
            },
        });

        let mailOptions = {
            from: email.from.id,
            to: email.to,
            subject: `[인싸월] ${moment().format("YYYY-MM-DD")} 트래픽 알림 😎`,
            html: emailTemplate,
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log("email sent : " + info.response);
            transporter.close();
        } catch (err) {
            console.error(err);
        }
    },
};
