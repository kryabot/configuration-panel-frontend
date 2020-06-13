import { NgModule } from "@angular/core";
import { StatusCardComponent } from "./status-card.component";
import { CommonModule } from "@angular/common";
import { NbCardModule } from "@nebular/theme";

@NgModule({
    imports: [
        CommonModule,
        NbCardModule
    ],
    exports: [StatusCardComponent],
    declarations: [StatusCardComponent],
    entryComponents: [],
  })
  export class StatusCardModule {}