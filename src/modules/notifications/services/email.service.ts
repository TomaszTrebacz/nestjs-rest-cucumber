import { readFileSync } from 'fs';
import { Injectable } from '@nestjs/common';
import { SES } from 'aws-sdk';
import { compile } from 'handlebars';
import { convert } from 'html-to-text';
import { createTransport } from 'nodemailer';
import { CONFIG } from '@/config';
import { logger } from '@/common/logger';

const getEmailTemplate = <T>(name: string) => {
  const templateFile = readFileSync(`./email-templates/${name}.html`, {
    encoding: 'utf-8',
  });

  return compile<T>(templateFile);
};

type ResetPasswordTemplate = {
  url: string;
};
const resetPasswordTemplate =
  getEmailTemplate<ResetPasswordTemplate>('reset-password');

@Injectable()
export class EmailService {
  private transporter = createTransport({
    SES: new SES({
      apiVersion: '2010-12-01',
      region: CONFIG.AWS.REGION,
      credentials: {
        accessKeyId: CONFIG.AWS.ACCESS_KEY,
        secretAccessKey: CONFIG.AWS.SECRET_KEY,
      },
    }),
  });

  send(to: string | string[], subject: string, html: string): void {
    (async () => {
      try {
        await this.transporter.sendMail({
          from: CONFIG.AWS.SES_EMAIL_FROM,
          to,
          subject,
          html,
          text: convert(html),
        });
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        logger.error({ ctx: 'send-email', err });
      }
    })();
  }

  sendResetPasswordEmail(to: string, resetPasswordToken: string): void {
    const subject = 'Password reset';
    const url = `${CONFIG.APP.FRONTEND_URL}/reset-password/${resetPasswordToken}`;

    const html = resetPasswordTemplate({
      url,
    });

    this.send(to, subject, html);
  }
}
