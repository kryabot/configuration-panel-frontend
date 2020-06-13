import { NgModule } from '@angular/core';
import { NbMenuModule, NbSpinnerModule, NbAlertModule, NbCardModule, NbDialogModule, NbIconModule } from '@nebular/theme';
import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';
import { GroupModule } from './telegram/group/group.module';
import { GroupMembersModule } from './telegram/group-members/group-members.module';
import { GroupRightsModule } from './telegram/group-rights/group-rights.module';
import { StatusCardModule } from '../@theme/components/status-card/status-card.module';
import { CommandsModule } from './twitch/commands/commands.module';
import { ChannelModule } from './twitch/channel/channel.module';
import { NoticeModule } from './twitch/notice/notice.module';
// import { DialogQuestionComponent } from '../@theme/components/modal/question-dialog/question-dialog.component';
import { PointRewardModule } from './twitch/pointreward/pointreward.module';
import { FormsModule } from '@angular/forms';
import { BannedMediaModule } from './telegram/banned-media/banned-media.module';
import { BannedWordModule } from './telegram/banned-word/banned-word.module';
import { AwardModule } from './telegram/award/award.module';
import { GroupStatsModule } from './telegram/stats/stats.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    NbSpinnerModule,
    NbAlertModule,
    NbCardModule,
    DashboardModule,
    GroupModule,
    GroupMembersModule,
    GroupRightsModule,
    CommandsModule,
    ChannelModule,
    NoticeModule,
    PointRewardModule,
    BannedMediaModule,
    BannedWordModule,
    AwardModule,
    GroupStatsModule,
    MiscellaneousModule,
    FormsModule,
    NbDialogModule.forChild(),
    NbIconModule
    
  ],
  declarations: [
    PagesComponent,
    // DialogQuestionComponent,
  ],
  exports: [StatusCardModule
  ],
  entryComponents:[
    // DialogQuestionComponent
  ]
})
export class PagesModule {
}
