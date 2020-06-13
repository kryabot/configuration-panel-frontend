import { NgModule } from '@angular/core';


import { ThemeModule } from '../../../@theme/theme.module';
import { GroupComponent } from './group.component';
import { NbCardModule, NbButtonModule } from '@nebular/theme';
import { StatusCardModule } from '../../../@theme/components/status-card/status-card.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  imports: [
    ThemeModule,
    NbCardModule,
    StatusCardModule,
    NgxChartsModule,
    NbButtonModule
  ],
  declarations: [
    GroupComponent,
  ],
})
export class GroupModule { }
