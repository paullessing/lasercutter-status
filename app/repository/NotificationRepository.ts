import { Notification, repository, NotificationDocument } from '../entities/notification';

class NotificationRepository {
    public create(notification: Notification): Promise<NotificationDocument> {
        return Promise.resolve(repository.create(notification));
    }

    public update(notification: NotificationDocument): Promise<void> {
        return Promise.resolve(notification.save());
    }

    public getActive(): Promise<NotificationDocument[]> {
        return new Promise<NotificationDocument[]>((resolve, reject) => {
            repository.find({ sentAt: null }).find((error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }

    /**
     * Marks all currently unsent notifications as sent at: [sentAt], then returns them.
     * This ensures that no two threads should be trying to send to the same email addresses.
     */
    public prepareUnsent(sentAt: Date): Promise<NotificationDocument[]> {
        return Promise.resolve(repository.update({
            sentAt: null
        }, {
            sentAt: sentAt
        }, {
            multi: true
        })).then(() => {
            return new Promise<NotificationDocument[]>((resolve, reject) => {
                repository.find({ sentAt: sentAt }).exec((err, result) => {
                    err && reject(err) || resolve(result)
                });
            });
        });
    }
}

let notificationRepository = new NotificationRepository();

export { notificationRepository as NotificationRepository };