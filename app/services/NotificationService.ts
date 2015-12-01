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
        var now = moment().toDate();

        NotificationRepository.prepareUnsent(now).then(notifications => {
            var emails = notifications.map(notification => notification.email);

            console.log("Sending emails to:", emails);
            // TODO implement
        });
    }
}

let notificationService = new NotificationService();

export { notificationService as NotificationService }