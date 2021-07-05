import { NbMenuItem, NbIconConfig } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'home-outline',
    link: '/app/dashboard',
    home: true,
  },
  {
    title: 'Permissions',
    icon: 'unlock-outline',
    link: '/app/grants',
  },
  {
    title: 'Bot configuration',
    group: true,
  },
  {
    title: 'Twitch bot',
    icon: 'video-outline',
    children: [
    {
      title: 'Chat commands',
      link: '/app/twitch/commands',
    },
    {
      title: 'Chat notices',
      link: '/app/twitch/notices',
    },
    {
      title: 'Channel point rewards',
      link: '/app/twitch/rewards',
    },
  ]
  },
  {
    title: 'Telegram bot',
    icon: 'navigation-2-outline',
    children: [
    {
      title: 'Group settings',
      link: '/app/telegram/group',
    },
    {
      title: 'Group members',
      link: '/app/telegram/groupmembers',
    },
    {
      title: 'Group rights',
      link: '/app/telegram/grouprights',
    },
    {
      title: 'Group awards',
      link: '/app/telegram/awards',
    },
    {
      title: 'Group statistics',
      link: '/app/telegram/stats',
    },
    {
      title: 'Banned media',
      link: '/app/telegram/media',
    },
    {
      title: 'Banned words',
      link: '/app/telegram/words',
    },

  ]
  },
];
