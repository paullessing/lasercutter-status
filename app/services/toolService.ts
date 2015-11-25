import {ToolDto, Tool} from "../entities/tool";

class ToolService {
    public getToolStatus(force?: boolean): Promise<Tool[]> {
        return Promise.resolve().then(() => {
            var dtos: ToolDto[] = [
                {
                    name: 'Laser Cutter',
                    status: 'Operational',
                    in_use: 'no'
                },
                {
                    name: 'Wibble',
                    status: 'Out of service',
                    in_use: 'no'
                }
            ];
            return dtos.map(dto => new Tool(dto));
        });
    }
}
let toolService = new ToolService();

export { toolService as ToolService };