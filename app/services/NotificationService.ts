/// <require path="../../typings/email-validator/email-validator.d.ts">

import { NotificationRepository } from '../repository/NotificationRepository';
import { Notification } from "../entities/notification";
import { validate as isEmailValid } from 'email-validator';
import * as moment from 'moment';

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
        NotificationRepository.getActive().then(notifications => {
            notifications.forEach(notification => {
                this.sendEmail(notification);
                notification.sentAt = moment().toDate();
                NotificationRepository.update(notification);
            });
        });
    }

    private sendEmail(notification: Notification) {
        // TODO send email
        console.log("Sending email to", notification.email);
    }
}

let notificationService = new NotificationService();

export { notificationService as NotificationService }