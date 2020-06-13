import { Component, OnInit, TemplateRef } from '@angular/core';
import { Command } from '../../../@core/model/Command.model';
import { BackendService } from '../../../@core/data/backend.service';
import { LocalDataSource } from 'ng2-smart-table';
import { NbDialogService, NbIconLibraries } from '@nebular/theme';
import { DialogQuestionComponent } from '../../../@theme/components/modal/question-dialog/question-dialog.component';
import { levelList, statusList, texts } from '../../lists.component';
import { AuthGuard } from '../../../auth-guard.service';
import { PagesComponent } from '../../pages.component';
import { CommandEditComponent } from './command-edit.component';

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './commands.component.html',
  styleUrls: ['../../pages.component.scss'],
})

export class CommandsComponent implements OnInit {
  commands: Command[];
  source: LocalDataSource = new LocalDataSource();
  alerts: any[];

  settings = {
    mode: 'external',
    noDataMessage: 'Only darkness here...',
    pager: {
      display: true,
      perPage: 50,
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="nb-gear"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    actions: { 
      position: 'right',
    },
    columns: {
      name: {
        title: 'Command name',
        type: 'string',
        show: true,
      },
      short_message: {
        title: 'Bot message',
        type: 'string',
      },
      cooldown: {
        title: 'Cooldown in seconds',
        type: 'number',
      },
      repeat_amount: {
        title: 'Repeat period in seconds',
        type: 'number',
      },
      level: {
        title: 'Access',
        editor: {
          type: 'list',
          config: {
            list: levelList
          },
        },
        filter: {
          type: 'list',
          config: {
            list: levelList
          },
        },
        valuePrepareFunction: (cell) => {
          return this.findTitleValueNumber(levelList, cell);
        }
      },
      active: {
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

  constructor(private backend: BackendService, private dialogService: NbDialogService, private guard:AuthGuard, private page: PagesComponent) {
    this.commands = [];
    this.alerts = [];
    this.initData();
  }

  ngOnInit() {

  }

  private initData(){
    this.page.startLoading();

    this.backend.getCommands().subscribe((data: Command[]) => {
      this.guard.validateApiResponse(data);
      this.commands = data;

      this.pushData();
      this.page.stopLoading();
    });
  }

  private pushData(){
    this.commands.forEach(cmd => cmd.short_message = this.formatShortMessage(cmd.reply_message));
    this.source = new LocalDataSource();
    this.source.load(this.commands);

    this.source.setSort([{ field: 'name', direction: 'asc' }]);
  }

  formatShortMessage(message: string): string{
    let maxLength = 30

    if (message.length > maxLength){
      return message.substr(0, maxLength) + '...'
    }

    return message
  }

  deleteCondifmed(event, result){
    if(result){
      this.page.startLoading();
      this.backend.deleteCommand(event.data)
      .subscribe((resp: any) => {
        this.commands = this.commands.filter(x => x.channel_command_id != event.data.channel_command_id)
        this.pushData();
        // event.confirm.resolve();
        this.createAlert('success', `${texts.DELETE_SUCCESS}`, 'left');
        this.page.stopLoading();
      }, error => {
        console.log(error)
        this.page.stopLoading();
        this.createAlert('warning', `You broke something again...`, 'left');
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

  onAlertClose(alert){
    this.alerts = this.alerts.filter(x => x != alert);
  }

  getCommandAlerts(){
    return this.alerts.filter(x => x.cardSide == 'left');
  }

  onRowSelect(event){

  }

  openWindow(event, isNew: boolean){
    this.dialogService.open(CommandEditComponent, {
      context: {
        data: event,
        isNew: isNew,
      },
      hasBackdrop: true,
      closeOnBackdropClick: false,
      closeOnEsc: false
    }).onClose.subscribe(output => {
      if(!output)
        return

      this.commands = output
      this.pushData()
    });;
  }

  deleteCommand(event){
    this.dialogService.open(DialogQuestionComponent)
    .onClose.subscribe((result: boolean) => {
      this.deleteCondifmed(event, result);
    });
  }

  createCommand(event){
    this.openWindow(event, true)
  }

  editCommand(event){
    this.openWindow(event, false)
  }

  help(dialog: TemplateRef<any>) {
    this.dialogService.open(
      dialog,
      { context: 'this is some additional data passed to dialog' });
  }
}