import * as mongoose from 'mongoose';

var notificationSchema = new mongoose.Schema({
    requestedAt: {
        type: Date,
        'default': Date.now,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    sentAt: {
        type: Date,
        required: false,
        'default': null
    }
});

interface Notification {
    requestedAt: Date;
    email: string;
    sentAt?: Date;
}

export interface NotificationDocument extends Notification, mongoose.Document {
}

var repository = mongoose.model<NotificationDocument>("Notification", notificationSchema);

export {
    Notification, repository
};
