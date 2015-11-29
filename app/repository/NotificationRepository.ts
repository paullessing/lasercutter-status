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
}

let notificationRepository = new NotificationRepository();

export { notificationRepository as NotificationRepository };