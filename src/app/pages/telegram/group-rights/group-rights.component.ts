import { Component } from '@angular/core';
import { BackendService } from '../../../@core/data/backend.service';
import { takeWhile } from 'rxjs/internal/operators/takeWhile';
import { AuthGuard } from '../../../auth-guard.service';
import { PagesComponent } from '../../pages.component';
import { LocalDataSource } from 'ng2-smart-table';
import { TgRight } from '../../../@core/model/TgRight.model';
import { NbDialogService } from '@nebular/theme';
import { DialogQuestionComponent } from '../../../@theme/components/modal/question-dialog/question-dialog.component';
import { texts } from '../../lists.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'ngx-tg-group-rights',
  styleUrls: ['./group-rights.component.scss'],
  templateUrl: './group-rights.component.html',
})

export class GroupRightsComponent {
    private alive = true;
    tgrights: TgRight[];
    memberRightsSource: LocalDataSource = new LocalDataSource();
    alerts: any[];

    memberRightsTableConfig = {
        noDataMessage: 'Nothing to show!',
        pager: {
          display: true,
          perPage: 50,
        },
        actions: {
            columnTitle: 'Remove',
            add: false,
            edit: false,
            delete: true,
            custom: [],
            position: 'right', // left|right
          },
        add: {
          addButtonContent: '<i class="nb-plus"></i>',
          createButtonContent: '<i class="nb-checkmark"></i>',
          cancelButtonContent: '<i class="nb-close"></i>',
          confirmCreate: true,
        },
        edit: {
          editButtonContent: '<i class="nb-edit"></i>',
          saveButtonContent: '<i class="nb-checkmark"></i>',
          cancelButtonContent: '<i class="nb-close"></i>',
          confirmSave: true,
        },
        delete: {
          deleteButtonContent: '<i class="nb-trash"></i>',
          confirmDelete: true,
        },
        columns: {
          tg_user_id:{
            title: "ID",
            width: "70px",
            editable: false,
            addable: false,
          },
          user_first_name: {
            title: 'First name',
            type: 'string',
          },

          user_last_name: {
            title: 'Last name',
            type: 'string',
          },

          username: {
            title: '@Username',
            type: 'string',
          },
          twitch_name: {
            title: 'Twitch name',
            type: 'string',
          },
          right_type: {
            title: 'Type',
            type: 'string',
          },
          added_by: {
            title: 'Added by',
            type: 'string',
          },
          ts: {
            title: 'Added at',
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
        this.tgrights = [];
        this.alerts = [];
        this.init();
    }

    init() {
      this.page.startLoading();

      this.backend.getTgMemberRights()
            .pipe(takeWhile(() => this.alive))
            .subscribe((data: any) => {
            this.page.stopLoading();
            this.guard.validateApiResponse(data);
            this.tgrights = data;
            this.pushData();
            });
    }
    private pushData(){
        this.memberRightsSource = new LocalDataSource();
        this.memberRightsSource.load(this.tgrights);
      }

    ngOnDestroy(): void {
        this.alive = false;
    }

    onDeleteConfirm(event): void {
      this.dialogService.open(DialogQuestionComponent)
        .onClose.subscribe((result: boolean) => {
          this.deleteCondifmed(event, result);
        });
    }

    deleteCondifmed(event, result){
      if(result){
        this.page.startLoading();

        this.backend.deleteTgMemberRight(event.data.tg_user_id)
        .subscribe((resp: any) => {
          this.createAlert('success', `${texts.RIGHT_DELETE_SUCCESS}`, 'rights');
          event.confirm.resolve();
          this.page.stopLoading();
        }, error => {
          event.confirm.reject();
          this.createAlert('warning', `You broke something again...`, 'rights');
          this.createAlert('danger', `Error from backend: ${error.statusText} (${error.status})`, 'left', true);
          this.page.stopLoading();
        });
      }
      else {
        event.confirm.reject();
      }

    }

  private createAlert(alertType:string, alertText: string, side: string, multi?:boolean){
    let alert = {size: 'xxsmall', status: alertType, message: alertText, cardSide: side};
      if(!multi){
        this.clearAlerts();
      }
    this.alerts.push(alert);
  }

  private clearAlerts(){
    this.alerts = [];
  }

  onAlertClose(alert){
    this.alerts = this.alerts.filter(x => x != alert);
  }

  getRightsAlert(){
    return this.alerts.filter(x => x.cardSide == 'rights');
  }
}
