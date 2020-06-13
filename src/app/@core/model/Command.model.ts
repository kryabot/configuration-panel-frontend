export class Command {
    channel_command_id: number;
    name: string;
    action: string;
    level: number;
    active: boolean;
    cooldown: number;
    repeat_amount: number;
    reply_message: string;
    additional_text: string;

    short_message: string;

    constructor(raw: any){
        if(!raw){
            this.name = ''
            this.action = 'custom_reply'
            this.level = 0
            this.active = true
            this.cooldown = 30
            this.repeat_amount = 0
            this.reply_message = ''
            this.additional_text = ''
            return
        }
            
        this.channel_command_id = raw.channel_command_id
        this.name = raw.name || ''
        this.action = raw.action || 'custom_reply'
        this.level = raw.level || 0
        this.active = raw.active
        this.cooldown = raw.cooldown || 30
        this.repeat_amount = raw.repeat_amount || 0
        this.reply_message = raw.reply_message || ''
        this.additional_text = raw.additional_text || ''
    }
}
