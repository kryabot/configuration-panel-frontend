/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
let apiHost = 'https:///api.krya.dev'
export const environment = {
  production: false,
  auth_config: {
    auth_name: 'twitch',
    client_id: 'lzh527wuv331ugpxjzpamffih3r7ia',
    client_secret: '',
    authorize_url: 'https://id.twitch.tv/oauth2/authorize',
    token_url: apiHost + '/login/webdev',
    // token_url: 'https://krya.oska.lt/api/twitch/get_token_dev.php',
    callbacl_url: 'http://localhost:4200/auth/callback',
    auth_scope: 'user_read',
  },
  bot_auth_config: {
    auth_name: 'twitch_bot',
    client_id: 'gq4h1ras3x7izs87eg26ufyu1rs2td',
    client_secret: '',
    authorize_url: 'https://id.twitch.tv/oauth2/authorize',
    token_url: apiHost + '/login/access',
    callbacl_url: 'http://192.168.0.170:4200/access/callback',
    auth_scope: 'channel_check_subscription channel_editor channel_subscriptions channel:read:subscriptions moderation:read bits:read',
  },
  donationalerts_config:{
    auth_name: 'donation_alerts',
    client_id: '354',
    client_secret: '',
    authorize_url: 'https://www.donationalerts.com/oauth/authorize',
    token_url: apiHost + '/login/da-access',
    callback_url: 'https://my.krya.dev/da-access/callback',
    auth_scope: 'oauth-donation-subscribe oauth-user-show'
  },
  data_api: {
    base_url: apiHost,
  },
};
