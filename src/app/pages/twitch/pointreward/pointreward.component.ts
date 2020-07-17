import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../../@core/data/backend.service';
import { PagesComponent } from '../../pages.component';
import { pointRewardActionList, texts, statusList } from '../../lists.component';
import { PointReward } from '../../../@core/model/PointReward';
import { LocalDataSource } from 'ng2-smart-table';
import { AuthGuard } from '../../../auth-guard.service';
import { NbDialogService } from '@nebular/theme';
import { DialogQuestionComponent } from '../../../@theme/components/modal/question-dialog/question-dialog.component';

@Component({
  selector: 'krya-point-reward',
  templateUrl: './pointreward.component.html',
  styleUrls: ['../../pages.component.scss'],
})

export class PointRewardComponent implements OnInit {

  rewards: PointReward[];
  pointRewardSource: LocalDataSource = new LocalDataSource();
  alerts: any[];

  pointRewardSettings = {
    noDataMessage: 'You have no point rewards configured yet...',
    pager: {
      display: true,
      perPage: 50,
    },
    actions: {
      position: 'right',
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
      title:{
        title: "Twitch reward title",
        type: "string",
      },
      action: {
        title: 'Action',
        editor: {
          type: 'list',
          config: {
            list: pointRewardActionList
          },
        },
        filter: {
          type: 'list',
          config: {
            list: pointRewardActionList
          },
        },
        valuePrepareFunction: (cell) => {
          return this.findTitleValueString(pointRewardActionList, cell);
        }
      },
      data:{
        title: "Twitch message on occurance",
        type: "string",
      },
      amount:{
        title: "Amount",
        type: "number",
      },
      enabled: {
        title: 'Status',
        editor: {
          type: 'list',
          config: {
            list: statusList
          },
        },
        filter: {
          type: 'list',
          config: {
            list: statusList
          },
        },
        valuePrepareFunction: (cell) => {
          return this.findTitleValueNumber(statusList, cell);
        }
      },
    },
  };

  constructor(private backend: BackendService, private page: PagesComponent, private guard: AuthGuard, private dialogService: NbDialogService){
    this.alerts = [];
    this.rewards = [];
    this.page.startLoading();
  }

  ngOnInit(): void {
    this.backend.getPointRewards()
    .subscribe((data: any) => {
      this.guard.validateApiResponse(data);
      this.rewards = data;
      this.loadTable();
      this.page.stopLoading();
    }, error => {

    });
  }
  private hasDuplicate(title: string, existingId: number): boolean {
    let findResult = null;

    if (existingId == null || existingId === 0) {
      findResult = this.rewards.find(x => x.title === title);
    } else {
      findResult = this.rewards.find(x => x.title === title && x.channel_point_action_id !== existingId)
    }

    if (findResult) return true;
    return false;
  }

  findTitleValueNumber(list, cell): string{
    let status = list.find(x => x.value === Number(cell));
    if(status) return status.title;
    return '?';
  }

  findTitleValueString(list, cell): string{
    let status = list.find(x => x.value === cell);
    if(status) return status.title;
    return '?';
  }

  private loadTable(){
    this.pointRewardSource = new LocalDataSource();
    this.pointRewardSource.load(this.rewards);
  }

  getRewardAlerts(){
    return this.alerts;
  }

  onAlertClose(alert){
    this.alerts = this.alerts.filter(x => x != alert);
  }

  deleteCondifmed(event, result){
    if(result){
      this.page.startLoading();
      this.backend.deletePointReward(event.data)
      .subscribe((resp: any) => {
        this.createAlert('success', `${texts.DELETE_SUCCESS}`, 'pointreward');
        event.confirm.resolve();
        this.page.stopLoading();
      }, error => {
        event.confirm.reject();
        console.log(error)
        this.createAlert('warning', `You broke something again...`, 'left');
        this.createAlert('danger', `Error from backend: ${error.statusText} (${error.status})`, 'left', true);
        this.page.stopLoading();
      });
    }
    else {
      event.confirm.reject();
    }
  }
  onDeleteConfirm(event): void {
    this.dialogService.open(DialogQuestionComponent)
      .onClose.subscribe((result: boolean) => {
        this.deleteCondifmed(event, result);
      });
  }

  onSaveConfirm(event){
    this.alerts = [];

    event.newData.channel_point_action_id = parseInt(event.newData.channel_point_action_id) || 0
    event.newData.amount = parseInt(event.newData.amount)
    event.newData.parent_id = parseInt(event.newData.parent_id) || 0
    event.newData.enabled = parseInt(event.newData.enabled) || 1

    if(!this.validInput(event.newData)){
      this.createAlert('warning', texts.INVALID_INPUTS, 'pointreward');
      event.confirm.reject();
      return;
    }

    if(!this.validInputNumber(event.newData)){
      this.createAlert('warning', texts.INVALID_COUNT_NUMBER, 'pointreward');
      event.confirm.reject();
      return;
    }

    if (this.hasDuplicate(event.newData.title, event.newData.channel_point_action_id)) {
      this.createAlert('warning', texts.DUPLICATE_POINT_REWARD, 'pointreward');
      return;
    }

    if(this.noChanges(event.newData)){
      event.confirm.resolve();
      return;
    }

    this.page.startLoading();
    this.backend.savePointReward(event.newData).subscribe((resp: any) => {
      this.createAlert('success', `${texts.CREATE_SUCCESS}`, 'pointreward');
      this.page.stopLoading();

      this.rewards = resp;
      this.loadTable();
      event.confirm.resolve();

    }, error => {
      event.confirm.reject();
      console.log(error)
      this.createAlert('warning', `You broke something again...`, 'left');
      this.createAlert('danger', `Error from backend: ${error.statusText} (${error.status})`, 'left', true);
      this.page.stopLoading();
    });
  }

  noChanges(row){
    console.log(row)
    if(!row) return true;
    /* New row */
    if(row.channel_point_action_id == null || row.channel_point_action_id == 0) return false;

    /* Find original row */
    let originalRow: PointReward = this.rewards.find(x => x.channel_point_action_id === row.channel_point_action_id);

    /* For safety, not send data to backend if user tried to edit non exiting row */
    if(originalRow == null) return true;

    if(row.channel_point_action_id != originalRow.channel_point_action_id) return false;
    if(row.action != originalRow.action) return false;
    if(row.title != originalRow.title) return false;
    if(row.data != originalRow.data) return false;
    if(row.amount != originalRow.amount) return false;
    if(row.parent_id != originalRow.parent_id) return false;
    if(row.enabled != originalRow.enabled) return false;

    return true;
  }

  onCreateConfirm(event){
    this.onSaveConfirm(event);
  }

  validInput(data): boolean{
    if (!data) return false;
    /* notice_type_id is empty when creating new row */
    if(!Number.isInteger(data.channel_point_action_id)) return false;
    if(!Number.isInteger(data.amount)) return false;
    if(!Number.isInteger(data.parent_id)) return false;
    if(!Number.isInteger(data.enabled)) return false;
    if(!data.action || data.action.length == 0) return false;
    if(!data.title || data.title.length == 0) return false;

    return true;
  }

  validInputNumber(data): boolean{
    if (!data) return false;
    if (data.channel_point_action_id && !this.isValidNumber(data.channel_point_action_id)) return false;
    if (!this.isValidNumber(data.amount)) return false;
    if (!this.isValidNumber(data.parent_id)) return false;
    if (!this.isValidNumber(data.enabled)) return false;

    return true;
  }

  isValidNumber(value): boolean{
    let num: number = Number(value);
    /* Invalid value: text or no value */
    if(isNaN(num)) return false;
    /*  Must be >= 0 */
    if(num < 0) return false;
    /* Must not be decimal */
    if(num % 1 != 0) return false;

    return true;
  }

  onRowSelect(event){
    console.log('onRowSelect');
  }

  createAlert(alertType:string, alertText: string, side: string, multi?:boolean){
    let alert = {size: 'xxsmall', status: alertType, message: alertText, cardSide: side};
    if(!multi){
      this.clearAlerts();
    }
    this.alerts.push(alert);
  }

  private clearAlerts(){
    this.alerts = [];
  }
}
