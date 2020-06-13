import { NgModule } from '@angular/core';
import { NbListModule, NbUserModule, NbAlertModule, NbSpinnerModule, NbCardModule, NbButtonModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { DashboardComponent } from './dashboard.component';
import { StatusCardModule } from '../../@theme/components/status-card/status-card.module';

@NgModule({
  imports: [
    ThemeModule,
    NbListModule,
    NbUserModule,
    NbSpinnerModule,
    NbAlertModule,
    NbCardModule,
    NbButtonModule
  ],
  declarations: [
    DashboardComponent,
  ],
})
export class DashboardModule { }
