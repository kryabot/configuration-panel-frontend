
export var texts = {
    CREATE_SUCCESS: "Successfully saved to my heart.",
    DELETE_SUCCESS: "Successfully deleted from my heart.",
    INVALID_INPUTS: "I know you are lazy, but please enter all inputs of editable row!",
    DUPLIDATE_COMMAND: "Rules everywhere... You can not have more then 1 command with same name!",
    BACKEND_ERROR: "Sorry, but i can not complete your wish now. I am currently busy fighting my depression, try again or later :(",
    COMMAND_LENGTH: "Your dreams are too big... Please reduce them to 50 symbols.",
    COMMAND_PARAM_LENGTH: "Your dreams are too big... Please reduce them to 300 symbols.",
    NOTICE_COUNT_OVERLAP: "It is not so hard! Count from or count to value is incorrect: interval is overlapping with existing row!",
    INVALID_COUNT_NUMBER: "Do you have math problems? Count value must be positive integer number!",
    INVALID_COUNT_INTERVAL: "zZzZz... Count from value must be lower than Count to value!",
    RIGHT_DELETE_SUCCESS: "Donisimo.",
    DUPLICATE_POINT_REWARD: "Reward title is unique, you cannot have more then 1 action for same reward!"
  };

export var statusList = [
    { value: 0, title: 'Disabled' },
    { value: 1, title: 'Enabled' },
    ];

export var levelList = [
    {value: 0, title: 'Everyone'},
    {value: 1, title: 'Follower'},
    {value: 2, title: 'Subscriber'},
    {value: 4, title: 'VIP'},
    {value: 6, title: 'Moderator'},
    {value: 7, title: 'Channel owner'},
    ];

export var paramKeyList= [
    {value: 'cd', title: 'Cooldown (number in seconds)'},
    {value: 'source', title: 'Source Type'},
    {value: 'reply_text', title: 'Reply text'},
    {value: 'skip', title: 'Skip text'},
    {value: 'target', title: 'Source ID'},
    ];

export var typeList = [
    {value: "custom_reply", title: "Chat reply"},
    // {value: "custom_whisper", title: "Whisper replay"},
    {value: "custom_song", title: "Chat reply (music)"},
    ];

export var noticeType = [
    {value: 1, title: "Subscribe (Tier1)"},
    {value: 2, title: "Subscribe (Tier2)"},
    {value: 3, title: "Subscribe (Tier3)"},
    {value: 4, title: "Twitch Prime"},
    {value: 5, title: "Gift Subscribe"},
    {value: 6, title: "Twitch Bits"},
    {value: 7, title: "Chat Raid"},
    {value: 8, title: "Extending of subscribed gift"},
    {value: 9, title: "Gift Subscribe (Mass)"},
];

export var subTypeList = [
    {value: "1000", title: "Subscriber (Tier 1)"},
    {value: "2000", title: "Subscriber (Tier 2)"},
    {value: "3000", title: "Subscriber (Tier 3)"},
    {value: "prime", title: "Subscriber (Prime)"},
    {value: "no", title: "No"},
    ];

export let pointRewardActionList = [
    // {value: "TWITCH_SUBMOD_ON",     title: "Twitch enable submod"},
    // {value: "TWITCH_SUBMOD_OFF",    title: "Twitch disable submod"},
    {value: 'TWITCH_MESSAGE',       title: 'Twitch chat message'},
    {value: 'TWITCH_MUTE_SELF',     title: 'Twitch mute user (self)'},
    {value: 'TWITCH_MUTE_OTHER',    title: 'Twitch mute user (other)'},
    // {value: "TG_MUTE_SELF",         title: "Telegram mute user (self)"},
    // {value: "TG_MUTE_OTHER",        title: "Telegram mute user (other)"},
    // {value: "TG_MESSAGE",           title: "Telegram group message"},
    // {value: "TG_AWARD",             title: "Telegram add award"},
];
