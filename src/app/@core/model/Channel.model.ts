import { Command } from './Command.model';

export class Channel {
    channel_id: number;
    channel_name: string;
    command_symbol: string;
    auto_join: boolean;
    commands: Command[];
    triggers: any;
    twitch_user: any;
}
