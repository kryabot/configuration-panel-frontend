import { TgMember } from './TgMember.model';

export class TgGroup {
    channel_subchat_id: number;
    channel_id: number;
    tg_chat_id: number;
    tg_chat_name: string;
    join_link: string;
    warn_period: number;
    clean_period: number;
    enabled_join: boolean;
    join_follower_only: boolean;
    join_sub_only: boolean;
    allow_prime: boolean;
    ban_time: number;
    last_member_refresh: Date;
    refresh_status: string;
    auto_kick: boolean;
    welcome_message: string;
    tg_members: TgMember[];
    link_changed: boolean;
    random_enabled: boolean;
    random_cooldown: number;
    auto_mass_kick: number;
    last_auto_kick: DataCue;
    notify_stream_status: boolean;
    getter_cooldown: number;
    reminder_cooldown: number;
    last_reminder: Date;
}
