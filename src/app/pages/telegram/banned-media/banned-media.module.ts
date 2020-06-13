import { NgModule } from '@angular/core';
import { ThemeModule } from '../../../@theme/theme.module';
import { BannedMediaComponent } from './banned-media.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbCardModule, NbAlertModule, NbIconModule, NbButtonModule } from '@nebular/theme';

@NgModule({
  imports: [
    ThemeModule,
    NbCardModule,
    NbAlertModule,
    Ng2SmartTableModule,
    NbIconModule,
    NbButtonModule,
  ],
  declarations: [
    BannedMediaComponent,
  ],
})
export class BannedMediaModule { }
