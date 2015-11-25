import { ToolService } from './services/toolService';
import { Tool } from './entities/tool';

ToolService.getToolStatus().then(tools => {
    console.log("Tools", tools);
});