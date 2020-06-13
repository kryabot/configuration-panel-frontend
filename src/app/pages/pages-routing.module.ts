import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GroupComponent } from './telegram/group/group.component';
import { GroupMembersComponent } from './telegram/group-members/group-members.component';
import { GroupRightsComponent } from './telegram/group-rights/group-rights.component';
import { NoticeComponent } from './twitch/notice/notice.component';
import { CommandsComponent } from './twitch/commands/commands.component';
import { PointRewardComponent } from './twitch/pointreward/pointreward.component';
import { BannedMediaComponent } from './telegram/banned-media/banned-media.component';
import { BannedWordComponent } from './telegram/banned-word/banned-word.component';
import { AwardComponent } from './telegram/award/award.component';
import { GroupStatsComponent } from './telegram/stats/stats.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';


const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'dashboard',
      component: DashboardComponent,
    },
    {
      path: 'permissions',
      component: DashboardComponent,
    },
    {
      path: 'telegram',
      children:[
        {
          path: 'group',
          component: GroupComponent,
        },
        {
          path: 'stats',
          component: GroupStatsComponent,
        },
        {
          path: 'groupmembers',
          component: GroupMembersComponent,
        },
        {
          path: 'grouprights',
          component: GroupRightsComponent,
        },
        {
          path: 'awards',
          component: AwardComponent,
        },
        {
          path: 'media',
          component: BannedMediaComponent,
        },
        {
          path: 'words',
          component: BannedWordComponent,
        },
        {path: '', redirectTo: 'group'},
        // {path: '**', redirectTo: 'group'}
      ]
    },
    {
      path: 'twitch',
      children:[
        {
          path: 'commands',
          component: CommandsComponent,
        },
        {
          path: 'notices',
          component: NoticeComponent,
        },
        {
          path: 'rewards',
          component: PointRewardComponent,
        },
        {path: '', redirectTo: 'commands'},
        // {path: '**', redirectTo: 'commands'}
      ]
    },

    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
