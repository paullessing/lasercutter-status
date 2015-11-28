import { Status, repository } from '../entities/status';
import * as moment from 'moment';

class StatusRepository {
    public save(isUp: boolean, isInUse: boolean): Promise<Status> {
        var status: Status = {
            fetchedAt: moment().toDate(),
            isUp: isUp,
            isInUse: isInUse
        };

        return Promise.resolve(repository.create(status));
    }

    public getLatest(): Promise<Status> {
        return new Promise<Status>((resolve, reject) => {
            repository.findOne({}).sort('-fetchedAt').limit(1).findOne((error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }
}

let statusRepository = new StatusRepository();

export { statusRepository as StatusRepository };