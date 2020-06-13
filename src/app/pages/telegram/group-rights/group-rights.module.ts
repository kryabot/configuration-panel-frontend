import { NgModule } from '@angular/core';
import { ThemeModule } from '../../../@theme/theme.module';
import { GroupRightsComponent } from './group-rights.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbCardModule, NbAlertModule } from '@nebular/theme';
//import { Ng2SmartTableModule } from '../../@theme/components/smart-table/smart-table.module';

@NgModule({
  imports: [
    ThemeModule,
    NbCardModule,
    NbAlertModule,
    Ng2SmartTableModule,
  ],
  declarations: [
    GroupRightsComponent,
  ],
})
export class GroupRightsModule { }
