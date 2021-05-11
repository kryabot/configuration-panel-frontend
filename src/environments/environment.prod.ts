/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
const apiHost = 'https:///api.krya.dev';
export const environment = {
  production: true,
  auth_config: {
    auth_name: 'twitch',
    client_id: 'kqlu3roeeqsnkc4i12xgv3dlwrlztu',
    client_secret: '',
    authorize_url: 'https://id.twitch.tv/oauth2/authorize',
    token_url: apiHost + '/login/web',
    callbacl_url: 'https://my.krya.dev/auth/callback',
    auth_scope: 'user_read',
  },
  bot_auth_config: {
    auth_name: 'twitch_bot',
    client_id: 'gq4h1ras3x7izs87eg26ufyu1rs2td',
    client_secret: '',
    authorize_url: 'https://id.twitch.tv/oauth2/authorize',
    token_url: apiHost + '/login/access',
    callbacl_url: 'https://my.krya.dev/access/callback',
    auth_scope: 'channel_check_subscription channel_subscriptions channel:read:subscriptions moderation:read bits:read channel:read:redemptions',
  },
  donationalerts_config: {
    auth_name: 'donation_alerts',
    client_id: '354',
    client_secret: '',
    authorize_url: 'https://www.donationalerts.com/oauth/authorize',
    token_url: apiHost + '/login/da-access',
    callback_url: 'https://my.krya.dev/da-access/callback',
    auth_scope: 'oauth-donation-subscribe oauth-user-show',
  },
  data_api:  {
    base_url: apiHost,
  },
};
