import { Component, TemplateRef } from '@angular/core';
import { BackendService } from '../../../@core/data/backend.service';
import { takeWhile } from 'rxjs/internal/operators/takeWhile';
import { AuthGuard } from '../../../auth-guard.service';
import { PagesComponent } from '../../pages.component';
import { LocalDataSource } from 'ng2-smart-table';
import { NbDialogService } from '@nebular/theme';
import { DialogQuestionComponent } from '../../../@theme/components/modal/question-dialog/question-dialog.component';
import { DatePipe } from '@angular/common';
import { BannedMedia } from '../../../@core/model/BannedMedia';
import { Award } from '../../../@core/model/Award';

@Component({
  selector: 'ngx-tg-awards',
  styleUrls: ['./award.component.scss'],
  templateUrl: './award.component.html',
})

export class AwardComponent {
    private alive = true;
    datas: Award[];
    dataSource: LocalDataSource = new LocalDataSource();
    alerts: any[];

    dataTableConfig = {
        noDataMessage: 'You do not have any awards configured, use + button to create one!',
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
          award_key: {
            title: 'Award key',
            type: 'string',
          },
          award_template: {
            title: 'Award template',
            type: 'string',
          },
          users: {
            title: 'Given to users',
            type: 'number',
          },
          total: {
            title: 'Total given amount',
            type: 'number',
          },
          name: {
            title: 'Created by',
            type: 'string',
            valuePrepareFunction: (val) => {
              if (val) {
                return val
              }
                return 'Not provided';
              }
          },
          ts: {
            title: 'Created at',
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
        this.datas = [];
        this.alerts = [];
        this.init();
    }

    init() {
      this.page.startLoading();

      this.backend.getTgAwards()
            .pipe(takeWhile(() => this.alive))
            .subscribe((data: any) => {
            this.page.stopLoading();
            this.guard.validateApiResponse(data);
            this.datas = data as Award[];
            this.pushData();
            });
    }
    private pushData(){
        this.dataSource = new LocalDataSource();
        this.dataSource.load(this.datas);
        this.dataSource.setSort([{ field: 'ts', direction: 'desc' }]);
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
        this.backend.deleteTgAward(event.data as Award)
        .subscribe((resp: any) => {
          this.createAlert('success', `Award successfuly deleted!`);
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
        this.backend.deleteAllTgAwards()
        .subscribe((resp: any) => {
          this.createAlert('success', `Removed all awards!`);
          this.datas = []
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
