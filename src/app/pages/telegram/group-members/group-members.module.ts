import { NgModule } from '@angular/core';


import { ThemeModule } from '../../../@theme/theme.module';
import { GroupMembersComponent } from './group-members.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbCardModule, NbCheckboxModule, NbButtonModule } from '@nebular/theme';
//import { Ng2SmartTableModule } from '../../@theme/components/smart-table/smart-table.module';

@NgModule({
  imports: [
    ThemeModule,
    NbCardModule,
    NbCheckboxModule,
    Ng2SmartTableModule,
    NbButtonModule,
  ],
  declarations: [
    GroupMembersComponent,
  ],
})
export class GroupMembersModule { }
