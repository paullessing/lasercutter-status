/// <require path="../../typings/email-validator/email-validator.d.ts">

import { NotificationRepository } from '../repository/NotificationRepository';
import { Notification } from "../entities/notification";
import { validate as isEmailValid } from 'email-validator';
import * as moment from 'moment';
import * as nodemailer from 'nodemailer';
import * as smtpPool from 'nodemailer-smtp-pool';

class NotificationService {
    public requestNotification(email: string): Promise<void> {
        if (!isEmailValid(email)) {
            return Promise.reject('invalid-email');
        }

        return NotificationRepository.create({
            requestedAt: moment().toDate(),
            email: email
        }).then(() => {});
    }

    public executeNotify() {
        var now = moment().toDate();

        NotificationRepository.prepareUnsent(now).then(notifications => {
            var emails = notifications.map(notification => notification.email);

            console.log("Sending emails to:", emails);

            var transport = nodemailer.createTransport(smtpPool({
                host: 'localhost',
                port: 25,
                maxConnections: 5,
                maxMessages: 100
            }));
            transport.sendMail({
                from: 'Laser Cutter <noreply@isthelasercutterworking.com>',
                bcc: emails,
                subject: 'Laser Cutter Status: UP',
                text: `
The laser cutter at the London Hackspace is back up!
Praise the Laser Cutter Monkeys!

Please feel free to check the status anytime at isthelasercutterworking.com.
`
            }, (err, info) => {
                if (err) {
                    console.error("Error sending mail", err);
                } else {
                    console.info("Mail sent:", info);
                }
            })
        });
    }
}

let notificationService = new NotificationService();

export { notificationService as NotificationService }