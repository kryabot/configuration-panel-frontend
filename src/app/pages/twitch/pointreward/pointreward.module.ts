import { NgModule } from '@angular/core';


import { ThemeModule } from '../../../@theme/theme.module';
import { PointRewardComponent } from './pointreward.component';
import { NbCardModule, NbAlertModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
// import { Ng2SmartTableModule } from '../../../@theme/components/ng2-smart-table/public-api';
// import { Ng2SmartTableModule } from 'ng2-smart-table';

@NgModule({
  imports: [
    ThemeModule,
    NbCardModule,
    NbAlertModule,
    Ng2SmartTableModule,
  ],
  declarations: [
    PointRewardComponent,
  ],
})
export class PointRewardModule { }
