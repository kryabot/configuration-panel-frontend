import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-dialog-question-prompt',
  templateUrl: 'question-dialog.component.html',
  styleUrls: ['question-dialog.component.scss'],
})
export class DialogQuestionComponent {

    question: string;

    constructor(protected ref: NbDialogRef<DialogQuestionComponent>) {}

    cancel() {
        this.ref.close(false);
    }

    submit() {
        this.ref.close(true);
    }
}