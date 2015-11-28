import {ToolDto, Tool} from "../entities/tool";
import * as request from 'request-promise';

class LaserCutterService {
    public getStatus(force?: boolean): Promise<Tool> {
        //return Promise.resolve(new Tool({
        //    name: 'LaserCutter SilverTail',
        //    status: 'Out of service',
        //    status_message: 'OK',
        //    in_use: 'no'
        //}));
        return this.fetchFromHttp();
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