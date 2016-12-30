import {ToolDto, Tool} from "../entities/tool";
import { StatusRepository } from '../repository/StatusRepository';
import { Status } from "../entities/status";
import { NotificationService } from './NotificationService';
import * as request from 'request-promise';
import * as moment from 'moment';

class LaserCutterService {
    public getStatus(force?: boolean): Promise<Status> {
        return StatusRepository.getLatest().then(status => {
            if (status) {
                var recently = moment().subtract(1, 'minutes');
                var fetchedAt = moment(status.fetchedAt);
                if (fetchedAt.isAfter(recently) && !force) {
                    return Promise.resolve(status);
                }
            }
            return this.fetchFromHttp().then(tool => {
                if (!status.isUp && tool.isUp) {
                    NotificationService.executeNotify();
                }
                return StatusRepository.save(tool.isUp, tool.isInUse);
            }).catch(err => {
                console.log("An error happened fetching the data", err);
                if (status) {
                    return status;
                } else {
                    throw err;
                }
            });
        }).catch(err => {
            console.log("Uncaught error", err);
            throw err;
        });
    }

    private fetchFromHttp(): Promise<Tool> {
        //return Promise.resolve(new Tool({
        //    name: 'LaserCutter SilverTail',
        //    status: 'Operational',
        //    status_message: 'OK',
        //    in_use: 'no'
        //}));

        return request.get({
            url: 'https://london.hackspace.org.uk/members/tools.php?summary&anonymous',
            json: true,
            timeout: 10000
        }).then((tools: ToolDto[]) => {
            var laserCutter = (tools || []).filter(tool => tool.name === 'LaserCutter SilverTail').pop();
            if (!laserCutter) {
                throw new Error('No information found about laser cutter!');
            }
            return new Tool(laserCutter);
        }).catch((error: any) => {
            console.error('Request failed', error);
            throw error;
        });
    }
}
let laserCutterService = new LaserCutterService();

export { laserCutterService as LaserCutterService };
