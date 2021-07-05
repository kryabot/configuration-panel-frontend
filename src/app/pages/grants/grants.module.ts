import { NgModule } from '@angular/core';
import { NbListModule, NbUserModule, NbAlertModule, NbSpinnerModule, NbCardModule, NbButtonModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { GrantsComponent } from './grants.component';
import { StatusCardModule } from '../../@theme/components/status-card/status-card.module';
import {Ng2SmartTableModule} from 'ng2-smart-table';

@NgModule({
  imports: [
    ThemeModule,
    NbListModule,
    NbUserModule,
    NbSpinnerModule,
    NbAlertModule,
    NbCardModule,
    NbButtonModule,
    Ng2SmartTableModule,
  ],
  declarations: [
    GrantsComponent,
  ],
})
export class GrantsModule { }
