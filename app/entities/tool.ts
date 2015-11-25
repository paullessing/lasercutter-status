const STATUS_UP     = 'Operational';
const STATUS_DOWN   = 'Out of service';
const STATUS_IN_USE = 'In use';

const IN_USE_YES = 'yes';
const IN_USE_NO  = 'no';

export interface ToolDto {
    name: string;
    status: string;
    status_message?: string;
    in_use: string;
}

export class Tool {
    constructor(private dto: ToolDto) {
    }

    public get name(): string {
        return this.dto.name;
    }
    public get isUp(): boolean {
        return this.dto.status === STATUS_UP || this.dto.status === STATUS_IN_USE;
    }
    public get isInUse(): boolean {
        return this.isUp && this.dto.in_use === IN_USE_YES;
    }
}