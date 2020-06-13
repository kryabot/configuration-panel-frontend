import { Component, TemplateRef } from '@angular/core';
import { BackendService } from '../../../@core/data/backend.service';
import { takeWhile } from 'rxjs/internal/operators/takeWhile';
import { AuthGuard } from '../../../auth-guard.service';
import { PagesComponent } from '../../pages.component';
import { LocalDataSource } from 'ng2-smart-table';
import { NbDialogService } from '@nebular/theme';
import { DialogQuestionComponent } from '../../../@theme/components/modal/question-dialog/question-dialog.component';
import { DatePipe } from '@angular/common';
import { BannedWord } from '../../../@core/model/BannedWord';

@Component({
  selector: 'ngx-tg-banned-media',
  styleUrls: ['./banned-word.component.scss'],
  templateUrl: './banned-word.component.html',
})

export class BannedWordComponent {
    private alive = true;
    words: BannedWord[];
    wordSource: LocalDataSource = new LocalDataSource();
    alerts: any[];

    wordTableConfig = {
        noDataMessage: 'You do not have any banned words!',
        hideSubHeader: true,
        pager: {
          display: true,
          perPage: 50,
        },
        actions: {
            columnTitle: '',
            add: false,
            edit: false,
            delete: true,
            custom: [],
            position: 'right', // left|right
          },
        delete: {
          deleteButtonContent: '<i class="nb-trash"></i>',
          confirmDelete: true,
        },
        columns: {
          word: {
            title: 'Banned word',
            type: 'string',
          },
          name: {
            title: 'Banned by',
            type: 'string',
            valuePrepareFunction: (val) => {
              if (val) {
                return val
              }
                return '-';
              }
          },
          created_ts: {
            title: 'Banned at',
            type: 'date',
            valuePrepareFunction: (date) => {
              if (date) {
                return new DatePipe('en-GB').transform(date, 'yyyy/MM/dd HH:mm', '+0600');
              }
                return null;
              },
          },
        },
      };


    constructor(private backend: BackendService, 
                private guard: AuthGuard, 
                private page: PagesComponent,
                private dialogService: NbDialogService) {
        this.words = [];
        this.alerts = [];
        this.init();
    }

    init() {
      this.page.startLoading();

      this.backend.getBannedWords()
            .pipe(takeWhile(() => this.alive))
            .subscribe((data: any) => {
            this.page.stopLoading();
            this.guard.validateApiResponse(data);
            this.words = data as BannedWord[];
            this.pushData();
            });
    }
    private pushData(){
        this.wordSource = new LocalDataSource();
        this.wordSource.load(this.words);
        this.wordSource.setSort([{ field: 'created_ts', direction: 'desc' }]);
      }

    ngOnDestroy(): void {
        this.alive = false;
    }

    onDeleteConfirm(event): void {
      this.alerts = [];
      this.dialogService.open(DialogQuestionComponent)
        .onClose.subscribe((result: boolean) => {
          this.deleteCondifmed(event, result);
        });
    }

    deleteCondifmed(event, result){
      if(result){
        this.page.startLoading();
        this.backend.deleteBannedWord(event.data as BannedWord)
        .subscribe((resp: any) => {
          this.createAlert('success', `Word successfully unbanned!`);
          event.confirm.resolve();
          this.page.stopLoading();
        }, error => {
          event.confirm.reject();
          this.createAlert('warning', `You broke something again...`);
          this.createAlert('danger', `Error from backend: ${error.statusText} (${error.status})`);
          this.page.stopLoading();
        });
      }
      else {
        event.confirm.reject();
      }

    }

  private createAlert(alertType:string, alertText: string){
    let alert = {size: 'xxsmall', status: alertType, message: alertText};
    this.alerts.push(alert);
  }

  onAlertClose(alert){
    this.alerts = this.alerts.filter(x => x != alert);
  }

  help(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog);
  }

  unbanAll(){
    this.alerts = [];
    this.dialogService.open(DialogQuestionComponent)
    .onClose.subscribe((result: boolean) => {
      if (result){
        this.page.startLoading();
        this.backend.deleteAllBannedWords()
        .subscribe((resp: any) => {
          this.createAlert('success', `Unbanned all medias!`);
          this.words = []
          this.pushData();
          this.page.stopLoading();
        }, error => {
          this.createAlert('warning', `You broke something again...`);
          this.createAlert('danger', `Error from backend: ${error.statusText} (${error.status})`);
          this.page.stopLoading();
        });
      }
    });
  }
}
