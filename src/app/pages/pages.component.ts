import { Component } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  templateUrl: './pages.component.html',
})
export class PagesComponent {
  loadingTitle: string;
  globalAlerts = [];
  backendLoading: boolean = false;
  loadingStart: Date;
  currentLoadingTime;
  message: string = '';
  menu = MENU_ITEMS;

  startLoading(){
    this.globalAlerts = [];
    this.loadingTitle = 'Preparing cookies';
    this.backendLoading = true;
    this.loadingStart = new Date();
    this.updateTime();
  }
  stopLoading(){
      this.loadingStart = null;
      setTimeout(() => this.backendLoading = false, 100);
  }
  updateTime(){
    if(!this.backendLoading) return;
    if(this.loadingStart == null) return;
    // this.loadingTitle = this.loadingTitle + '.';
    // this.loadingTitle.replace('.', '!');
    let now = new Date();
    let diff = now.getTime() - this.loadingStart.getTime()

    if (diff > 20000) {
      this.createGlobalAlert('danger', 'Connection to backend timed out! Sorry!', true);
      this.createGlobalAlert('danger', 'Part of functionality is not available.', true);
      this.stopLoading();
      return;
    }
    this.currentLoadingTime = diff.toString();
    setTimeout(() => this.updateTime(), 500);
  }

  createGlobalAlert(alertType:string, alertText: string, multi?:boolean){
    let alert = {size: 'xxsmall', status: alertType, message: alertText};
    if(!multi){
      this.globalAlerts = [];
    }
    this.globalAlerts.push(alert);
  }

  onAlertClose(alert){
    this.globalAlerts = this.globalAlerts.filter(x => x != alert);
  }
}
