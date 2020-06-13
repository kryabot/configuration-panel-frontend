import { NgModule } from '@angular/core';


import { ThemeModule } from '../../../@theme/theme.module';
import { ChannelComponent } from './channel.component';
import { StatusCardModule } from '../../../@theme/components/status-card/status-card.module';
import { NbCardModule } from '@nebular/theme';

@NgModule({
  imports: [
    ThemeModule,
    NbCardModule,
    StatusCardModule,
  ],
  declarations: [
    ChannelComponent,
  ],
})
export class ChannelModule { }
