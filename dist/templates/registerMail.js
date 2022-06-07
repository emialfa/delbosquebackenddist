"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require('nodemailer');
const googleapis_1 = require("googleapis");
require("dotenv").config();
const registerMail = (pnombre, pemail, ptoken) => __awaiter(void 0, void 0, void 0, function* () {
    const CLIENT_EMAIL = process.env.MAIL_USER;
    const CLIENT_ID = process.env.GOOGLE_APP_EMAIL_CLIENT_ID;
    const CLIENT_SECRET = process.env.GOOGLE_APP_EMAIL_CLIENT_SECRET;
    const REDIRECT_URI = process.env.GOOGLE_APP_EMAIL_CLIENT_REDIRECT_URI;
    const REFRESH_TOKEN = process.env.GOOGLE_APP_EMAIL_REFRESH_TOKEN;
    const OAuth2Client = new googleapis_1.google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    OAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
    try {
        // Generate the accessToken on the fly
        const accessToken = yield OAuth2Client.getAccessToken();
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: CLIENT_EMAIL,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
        let mail_options = {
            from: CLIENT_EMAIL,
            to: pemail,
            subject: "Verificación de email",
            html: `<table width="100%" border="0" cellspacing="0" cellpadding="0" style="width:100%!important">
        <tbody><tr><td align="center">
      <table style="border:1px solid #eaeaea;border-radius:5px;margin:40px 0" width="600" border="0" cellspacing="0" cellpadding="40">
        <tbody><tr><td align="center"><div style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif;text-align:left;width:465px">
      
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="width:100%!important">
        <tbody><tr><td align="center">
        <div><img src="https://res.cloudinary.com/delbosque-tienda/image/upload/v1636597375/DBB_-_LOGO_1__page-0001_1_Traced_z7exbh.png" width="108.9" height="88.61" alt="DelBosqueBordados" class="CToWUd" style='margin-bottom: 40px'></div>
        <h1 style="color:#000;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif;font-size:24px;font-weight:normal;margin:30px 0;padding:0">Verifica tu email para registrarte en la tienda</h1>
      </td></tr>
      </tbody></table>
      
      <p style="color:#000;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif;font-size:14px;line-height:24px">Hola ${pnombre}, para completar el proceso de registro en la tienda  solo falta que nos confirmes tu mail. Clickea en el boton de debajo
      para confirmar tu email:</p>
      <br>
      
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="width:100%!important">
        <tbody><tr><td align="center">
      <div>
        
          <a href="${process.env.URL}/auth/mailconfirm?token=${ptoken}" style="background-color:#99877D;border-radius:15px;color:#fff;display:inline-block;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif;font-size:14px;font-weight:500;text-align:center;text-decoration:none;padding:15px 30px;white-space:nowrap;" target="_blank">Confirmar Mail</a>
        
      </div>
      </td></tr>
      </tbody></table>
      
      <br>
      <p style="color:#000;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif;font-size:14px;line-height:24px">O copia y pega este link en tu navegador:</p>
      <p style="color:#000;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif;font-size:14px;line-height:24px">
      <a href="${process.env.URL}/auth/mailconfirm?token=${ptoken}" style="color:#067df7;text-decoration:none" target="_blank">${process.env.URL}<span class="il">/auth/mailconfirm</span>?<wbr>token=<wbr>${ptoken}</a></p>
      <br>
      <hr style="border:none;border-top:1px solid #eaeaea;margin:26px 0;width:100%">
      <p style="color:#666666;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,&quot;Roboto&quot;,&quot;Oxygen&quot;,&quot;Ubuntu&quot;,&quot;Cantarell&quot;,&quot;Fira Sans&quot;,&quot;Droid Sans&quot;,&quot;Helvetica Neue&quot;,sans-serif;font-size:12px;line-height:24px">Por favor no responda este mail.</p>
      </div></td></tr>
      </tbody></table>
      </td></tr>
      </tbody></table>`,
            text: `Verifica tu mail para registrarte en la tienda <br><br> Hola ${pnombre}, para completar el proceso de registro en la tienda solo falta que nos confirmes tu email. Ingresa al siguiente link para confirmar tu email: ${process.env.URL}/auth/mailconfirm?token=${ptoken}`,
        };
        transporter.sendMail(mail_options, (error, info) => {
            if (error) {
                console.log(error);
            }
            else {
                console.log("El correo se envío correctamente " + info.response);
                return { success: true };
            }
        });
    }
    catch (error) {
        return error;
    }
});
module.exports = registerMail;
//# sourceMappingURL=registerMail.js.map