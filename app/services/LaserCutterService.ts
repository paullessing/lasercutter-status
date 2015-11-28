import {ToolDto, Tool} from "../entities/tool";
import { StatusRepository } from '../repository/StatusRepository';
import { Status } from "../entities/status";
import * as request from 'request-promise';
import * as moment from 'moment';

class LaserCutterService {
    public getStatus(force?: boolean): Promise<Status> {
        //return Promise.resolve(new Tool({
        //    name: 'LaserCutter SilverTail',
        //    status: 'Out of service',
        //    status_message: 'OK',
        //    in_use: 'no'
        //}));
        return StatusRepository.getLatest().then(status => {
            if (status) {
                var recently = moment().subtract(5, 'minutes');
                var fetchedAt = moment(status.fetchedAt);
                if (fetchedAt.isAfter(recently)) {
                    return Promise.resolve(status);
                }
            }
            return this.fetchFromHttp().then(tool => {
                return StatusRepository.save(tool.isUp, tool.isInUse);
            });
        }).catch(err => {
            console.log("Uncaught error", err);
            throw err;
        });
    }

    private fetchFromHttp(): Promise<Tool> {
        return request.get({
            url: 'https://london.hackspace.org.uk/members/tools.php?summary&anonymous',
            json: true
        }).then((tools: ToolDto[]) => {
            var laserCutter = tools.filter(tool => tool.name === 'LaserCutter SilverTail').pop();
            if (!laserCutter) {
                throw new Error('No information found about laser cutter!');
            }
            return new Tool(laserCutter);
        });
    }
}
let laserCutterService = new LaserCutterService();

export { laserCutterService as LaserCutterService };