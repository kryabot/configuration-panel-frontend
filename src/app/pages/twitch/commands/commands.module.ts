import { NgModule } from '@angular/core';
import { ThemeModule } from '../../../@theme/theme.module';
import { CommandsComponent } from './commands.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbCardModule, NbAlertModule, NbCheckboxModule, NbButtonModule, NbInputModule, NbSelectModule, NbSpinnerModule, NbIconModule } from '@nebular/theme';
import { CommandEditComponent } from './command-edit.component';
import { FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    ThemeModule,
    NbCardModule,
    NbAlertModule,
    Ng2SmartTableModule,
    FormsModule,
    NbCheckboxModule,
    NbInputModule,
    NbButtonModule,
    NbSelectModule,
    NbSpinnerModule,
    NbIconModule
  ],
  declarations: [
    CommandsComponent,
    CommandEditComponent,
  ],
  entryComponents:[
    CommandEditComponent,
  ]
})
export class CommandsModule { }
