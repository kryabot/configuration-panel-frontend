import { NgModule } from '@angular/core';
import { ThemeModule } from '../../../@theme/theme.module';
import { GroupStatsComponent } from './stats.component';
import { NbCardModule, NbAlertModule, NbSpinnerModule } from '@nebular/theme';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MessageBarComponent } from './message-bar/message-bar.component';
import { TotalBarComponent } from './total-bar/total-bar.component';



@NgModule({
  imports: [
    ThemeModule,
    NbCardModule,
    NbAlertModule,
    // Ng2SmartTableModule,
    NgxEchartsModule,
    NbSpinnerModule,
    // NgxChartsModule,

  ],
  declarations: [
    GroupStatsComponent,
    MessageBarComponent,
    TotalBarComponent,
  ],
})
export class GroupStatsModule { }
