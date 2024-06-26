import { Request, Response, Router } from "express";
import Email, { ValidationError, isEmailModel } from "../models/emailModel.js";
import sendMail from "../services/mailService.js";
import basicHttpAuthentication from "../middleware/authenticate.js";
import newrelic from "newrelic";
const router: Router = Router();

/**
 * @openapi
 * components:
 *  schemas:
 *      Email:
 *          type: object
 *          properties:
 *              emailAddress:
 *                  type: string
 *              name:
 *                  type: string
 *              subject:
 *                  type: string
 *              message:
 *                  type: string
 *          required:
 *              - emailAddress
 *              - name
 *              - subject
 *              - message
 *  securitySchemes:
 *     basicAuth:
 *      type: http
 *      scheme: basic
 *
 * tags:
 *  -name: Email
 */

/**
 * @openapi
 * /send-mail/promotion:
 *  post:
 *      tags:
 *          - Email
 *      summary: Send email to user in 'promotion' template
 *      description: Send email to user in 'promotion' template
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Email'
 *      responses:
 *          "200":
 *              description: Email sent successfully
 *          "400":
 *              description: Bad Request
 *          "401":
 *              description: Unauthorized
 *          "500":
 *              description: Internal Server Error
 *      security:
 *         - basicAuth: []
 */
router.post(
  "/promotion",
  basicHttpAuthentication,
  async (req: Request, res: Response) => {
    try {
      const emailData: Email = req.body;
      isEmailModel(emailData);

      if (emailData) {
        const to: string = emailData.emailAddress;
        const subject: string = emailData.subject;
        const mailTemplate: string = "email_promotion";
        const context: object = {
          name: emailData.name,
          subject: emailData.subject,
          message: emailData.message,
        };

        sendMail(to, subject, mailTemplate, context);

        res.sendStatus(200);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        if (error instanceof ValidationError) {
          newrelic.noticeError(error, {
            status: 400,
            message: error.message,
          });
          res.status(400).send(error.message);
        } else {
          newrelic.noticeError(error, {
            status: 500,
            message: error.message,
          });
          res.sendStatus(500);
        }
      }
    }
  }
);

/**
 * @openapi
 * /send-mail/reminder:
 *  post:
 *      tags:
 *          - Email
 *      summary: Send email to user in 'reminder' template
 *      description: Send email to user in 'reminder' template
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Email'
 *      responses:
 *          "200":
 *              description: Email sent successfully
 *          "400":
 *              description: Bad Request
 *          "401":
 *              description: Unauthorized
 *          "500":
 *              description: Internal Server Error
 *      security:
 *         - basicAuth: []
 */
router.post(
  "/reminder",
  basicHttpAuthentication,
  async (req: Request, res: Response) => {
    try {
      const emailData: Email = req.body;
      isEmailModel(emailData);

      if (emailData) {
        const to: string = emailData.emailAddress;
        const subject: string = emailData.subject;
        const mailTemplate: string = "email_reminder";
        const context: object = {
          name: emailData.name,
          subject: emailData.subject,
          message: emailData.message,
        };

        sendMail(to, subject, mailTemplate, context);

        res.sendStatus(200);
      }
    } catch (error) {
      console.error(error);
      if (error instanceof ValidationError) {
        res.status(400).send(error.message);
      } else {
        res.sendStatus(500);
      }
    }
  }
);

export default router;
