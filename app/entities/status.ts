import * as mongoose from 'mongoose';

var statusSchema = new mongoose.Schema({
    fetchedAt: {
        type: Date,
        'default': Date.now,
        required: true
    },
    isUp: {
        type: Boolean,
        required: true
    },
    isInUse: {
        type: Boolean,
        required: true
    }
});

interface Status {
    fetchedAt: Date;
    isUp: boolean;
    isInUse: boolean;
}

interface StatusDocument extends Status, mongoose.Document {
}

var repository = mongoose.model<StatusDocument>("Status", statusSchema);

export {
    Status, repository
};
