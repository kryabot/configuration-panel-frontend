import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NbCardModule, NbButtonModule } from "@nebular/theme";
import { DialogQuestionComponent } from './question-dialog.component';
import { ThemeModule } from '../../../theme.module';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        NbCardModule,
        NbButtonModule,
    ],
    exports: [DialogQuestionComponent],
    declarations: [DialogQuestionComponent],
    entryComponents: [],
  })
  export class DialogQuestionModule {}