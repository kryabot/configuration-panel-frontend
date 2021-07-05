import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { Command } from '../../../@core/model/Command.model';
import {checkTypeList, levelList, texts} from '../../lists.component';
import { BackendService } from '../../../@core/data/backend.service';

@Component({
  selector: 'ngx-command-edit',
  templateUrl: 'command-edit.component.html',
  styleUrls: ['command-edit.component.scss'],
})
export class CommandEditComponent implements OnInit {
  @Input() data: any;
  @Input() isNew: boolean;

  modalTitle: string = '';
  existingData = [];
  submitted: boolean = false;
  command: Command;
  levelDropdown = [];
  typeDropdown = [];
  checking: boolean = false;
  alerts: any[];

  secs_week = 604800;
  cooldown_min = 5;

  saved = 'primary';

  constructor(protected ref: NbDialogRef<CommandEditComponent>, private backend: BackendService) {
    this.clearAlerts();
  }

  ngOnInit() {
    if (this.isNew) {
        this.command = new Command(null);
        this.modalTitle = 'Creation of new command';
        this.existingData = this.data.source.data;
    } else {
        this.command = new Command(this.data.data);
        this.modalTitle = 'Edit of command';
        this.existingData = this.data._dataSet.data;
    }
    this.levelDropdown = levelList;
    this.typeDropdown = checkTypeList;
    this.submitted = false;
  }

  dismiss(data: any = null) {
    this.ref.close(data);
  }

  validateName(silent: boolean = true): boolean {
    if (!this.command.name || this.command.name.trim().length === 0) {
      this.createWarning(`Command trigger cannot be empty!`, silent);
      return false;
    }

    if (this.command.check_type === 0 && this.command.name.includes(' ')) {
      this.createWarning(`Command trigger can not have spaces!`, silent);
      return false;
    }

    if (this.command.name.length > 200) {
      this.createWarning(`Sorry, but command trigger can not exceed 200 symbols!`, silent);
      return false;
    }

    if (this.hasDuplicate()) {
      this.createWarning(`Command with trigger ${this.command.name} already exists!`, silent);
      return false;
    }

    return true;
  }

  validateCooldown(silent: boolean = true): boolean {
    if (!this.isInt(this.command.cooldown)) {
      this.createWarning(`Cooldown must be positive integer number!`, silent)
      return
    }

    if (this.command.cooldown < this.cooldown_min){
      this.createWarning(`Cooldown must be bigger than ${this.cooldown_min}!`, silent)
      return
    }

    if (this.command.cooldown >= this.secs_week){
      this.createWarning(`Cooldown must be lower than week!`, silent)
      return
    }

    return true
  }

  validateRepeat(silent: boolean = true): boolean{
    if (!this.isInt(this.command.repeat_amount)){
      this.createWarning(`Repeat period must be positive integer number!`, silent)
      return
    }

    if (this.command.repeat_amount < 0){
      this.createWarning(`Repeat period must be bigger than 0!`, silent)
      return
    }

    if (this.command.repeat_amount >= this.secs_week){
      this.createWarning(`Repeat period must be lower than week!`, silent)
      return
    }

    return true
  }

  validateLevel(silent: boolean = true): boolean {
    if (!this.isInt(parseInt(this.command.level.toString()))){
      this.createWarning(`Incorrect access level value!`, silent)
      return
    }

    if (this.command.level > 9 || this.command.level < 0){
      this.createWarning(`Incorrect access level value!`, silent)
      return
    }

    return true
  }

  validate(){
    if(!this.validateName(false)){
      return
    }

    if(!this.validateCooldown(false)){
      return
    }

    if(!this.validateRepeat(false)){
      return
    }

    if(!this.validateLevel(false)){
      return
    }
  }

  onSubmit(){
    this.clearAlerts()
    this.submitted = true
    this.checking = true

    this.validate()
    if(this.alerts.length > 0){
      this.stopLoading()
      return
    }

    if(this.unchangedData()){
      this.dismiss()
      return;
    }

    if(this.command.active) {
      this.command.active = true
    }
    else {
      this.command.active = false
    }

    this.backend.saveCommand(this.command)
      .subscribe((resp: any) => {
        this.saved = 'success'
        setTimeout(() => this.dismiss(resp), 2000);
      },
      error => {

        if (error.error && error.error.error){
          this.saved = 'warning'
          this.createAlert('warning', `Failed to save: ${error.error.error}`,);
        } else {
          this.saved = 'danger'
          this.createAlert('warning', `You broke something again...`);
          this.createAlert('danger', `Error from backend: ${error.statusText} (${error.status})`,);
        }

        setTimeout(() => this.stopLoading(), 1000);
      });
  }

  private unchangedData(): boolean{
    if(this.isNew)
      return false

    let data = this.command
    let originalRow = this.existingData.find(x => x.channel_command_id == data.channel_command_id);
    if(!originalRow) return false;
    if(originalRow.channel_command_id != data.channel_command_id) return false;
    if(originalRow.name != data.name) return false;
    if(originalRow.active != data.active) return false;
    if(originalRow.level != data.level) return false;
    if(originalRow.cooldown != data.cooldown) return false;
    if(originalRow.repeat_amount != data.repeat_amount) return false;
    if(originalRow.reply_message != data.reply_message) return false;

    return true;
  }

  private hasDuplicate(): boolean{
    let findResult = null
    if(this.isNew)
      findResult = this.existingData.find(x => x.name.trim().toLowerCase() === this.command.name.trim().toLowerCase() );
    else
      findResult = this.existingData.find(x => x.name.trim().toLowerCase() === this.command.name.trim().toLowerCase() && x.channel_command_id != this.command.channel_command_id)

    return findResult != null;
  }


  private clearAlerts(){
    this.alerts = [];
  }
  onAlertClose(alert){
    this.alerts = this.alerts.filter(x => x != alert);
  }

  createWarning(text: string, silent: boolean){
    if(silent)
      return
    this.createAlert('warning', text)
  }

  createAlert(alertType:string, alertText: string){
    let alert = {size: 'xxsmall', status: alertType, message: alertText};
    this.alerts.push(alert);
  }

  getButtonTitle(){
    return this.isNew ? 'Create' : 'Update'
  }

  getNameStatus(){
    return !this.validateName() ? 'danger' : ''
  }

  isInt(val: any): boolean{
    return Number.isInteger(val)
  }

  stopLoading(){
    this.saved = 'primary'
    this.checking = false
  }
}
