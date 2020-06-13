import { NgModule } from '@angular/core';


import { ThemeModule } from '../../../@theme/theme.module';
import { NoticeComponent } from './notice.component';
// import { Ng2SmartTableModule } from '../../../@theme/components/smart-table/smart-table.module';
import { NbCardModule, NbAlertModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';

@NgModule({
  imports: [
    ThemeModule,
    NbCardModule,
    NbAlertModule,
    Ng2SmartTableModule,
  ],
  declarations: [
    NoticeComponent,
  ],
})
export class NoticeModule { }
