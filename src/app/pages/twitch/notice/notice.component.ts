import { Component, OnInit } from '@angular/core';
import { BackendService } from '../../../@core/data/backend.service';
import { PagesComponent } from '../../pages.component';
import { noticeType, texts } from '../../lists.component';
import { ChannelNotice } from '../../../@core/model/ChannelNotice';
import { LocalDataSource } from 'ng2-smart-table';
import { AuthGuard } from '../../../auth-guard.service';
import { NbDialogService } from '@nebular/theme';
import { DialogQuestionComponent } from '../../../@theme/components/modal/question-dialog/question-dialog.component';
import { empty } from 'rxjs';

@Component({
  selector: 'krya-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['../../pages.component.scss'],
})

export class NoticeComponent implements OnInit {
  notices: ChannelNotice[];
  // selectedNotice: ChannelNotice;
  noticeSource: LocalDataSource = new LocalDataSource();
  alerts: any[];

  noticeSettings = {
    noDataMessage: 'No food here...',
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
      reply:{
        title: "Text",
        type: "string",
        width: "50%",
        editor: {
          type: 'textarea',
          height: '100px',
        }
      },
      notice_type_id: {
        title: 'Notice type',
        editor: {
          type: 'list',
          config: {
            list: noticeType
          },
        },
        filter: {
          type: 'list',
          config: {
            list: noticeType
          },
        },
        valuePrepareFunction: (cell) => {
          return this.findTitleValueNumber(noticeType, cell);
        }
      },
      count_from:{
        title: "Count from",
        width: "100px",
        type: "number",
      },
      count_to:{
        title: "Count to",
        width: "100px",
        type: "number",
      },

    },
  };

  constructor(private backend: BackendService, private page: PagesComponent, private guard: AuthGuard, private dialogService: NbDialogService){
    this.alerts = [];
    this.notices = [];
    this.page.startLoading();
  }

  ngOnInit(): void {
    this.backend.getNotices()
    .subscribe((data: any) => {
      this.guard.validateApiResponse(data);
      this.notices = data;
      this.loadTable();
      this.page.stopLoading();
    }, error => {

    });
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
    this.noticeSource = new LocalDataSource();
    this.noticeSource.load(this.notices);
  }

  getNoticeAlerts(){
    return this.alerts;
  }

  onAlertClose(alert){
    this.alerts = this.alerts.filter(x => x != alert);
  }

  deleteCondifmed(event, result){
    if(result){
      this.page.startLoading();
      this.backend.deleteNotice(event.data)
      .subscribe((resp: any) => {
        this.createAlert('success', `${texts.DELETE_SUCCESS}`, 'notice');
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

    event.newData.notice_type_id = parseInt(event.newData.notice_type_id)
    event.newData.count_from = parseInt(event.newData.count_from)
    event.newData.count_to = parseInt(event.newData.count_to)
    event.newData.channel_notice_id = parseInt(event.newData.channel_notice_id) || 0

    if(!this.validInput(event.newData)){
      this.createAlert('warning', texts.INVALID_INPUTS, 'notice');
      event.confirm.reject();
      return;
    }

    if(!this.validInputNumber(event.newData)){
      this.createAlert('warning', texts.INVALID_COUNT_NUMBER, 'notice');
      event.confirm.reject();
      return;
    }

    if(Number(event.newData.count_from) > Number(event.newData.count_to)){
      this.createAlert('warning', texts.INVALID_COUNT_INTERVAL, 'notice');
      event.confirm.reject();
      return;
    }

    if(this.hasCountOverlap(event.newData)){
      this.createAlert('warning', texts.NOTICE_COUNT_OVERLAP, 'notice');
      event.confirm.reject();
      return;
    }

    if(this.noChanges(event.newData)){
      event.confirm.resolve();
      return;
    }

    this.page.startLoading();
    this.backend.saveNotice(event.newData).subscribe((resp: any) => {
      this.createAlert('success', `${texts.CREATE_SUCCESS}`, 'trigger');
      this.page.stopLoading();

      this.notices = resp;
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
    if(row.channel_notice_id == null || row.channel_notice_id == 0) return false;

    /* Find original row */
    let originalRow: ChannelNotice = this.notices.find(x => x.channel_notice_id === row.channel_notice_id);
    
    /* For safety, not send data to backend if user tried to edit non exiting row */
    if(originalRow == null) return true;

    console.log(row);
    console.log(originalRow);
    if(row.notice_type_id != originalRow.notice_type_id) return false;
    if(row.count_from != originalRow.count_from) return false;
    if(row.count_to != originalRow.count_to) return false;
    if(row.reply != originalRow.reply) return false;

    return true;
  }

  hasCountOverlap(row): boolean{
    // console.log('hasCountOverlap');
    let overlapList: ChannelNotice[] = this.notices.filter(x => (
      x.notice_type_id == row.notice_type_id && ((x.count_from <= row.count_from && x.count_to >= row.count_from) || (x.count_from <= row.count_to && x.count_to >= row.count_to))
      ));

    if(row.channel_notice_id.toString() > ''){
      // console.log('filtering existing');
      overlapList = overlapList.filter(x => x.channel_notice_id != row.channel_notice_id);
    }
      // console.log(overlapList.length);
    if (overlapList.length == 0) return false; 
    return true;
  }
  onCreateConfirm(event){
    this.onSaveConfirm(event);
  }

  validInput(data): boolean{
    if (!data) return false;
    /* notice_type_id is empty when creating new row */
    if(!Number.isInteger(data.notice_type_id)) return false;
    if(!Number.isInteger(data.count_from)) return false;
    if(!Number.isInteger(data.count_to)) return false;
    if(!data.reply || data.reply.length == 0) return false;
    
    return true;
  }

  validInputNumber(data): boolean{
    if (!data) return false;
    if (data.notice_type_id && !this.isValidNumber(data.notice_type_id)) return false;
    if (!this.isValidNumber(data.count_from)) return false;
    if (!this.isValidNumber(data.count_to)) return false;

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
