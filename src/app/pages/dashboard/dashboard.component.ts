import { Component, Input } from '@angular/core';
import { BackendService } from '../../@core/data/backend.service';
import { PagesComponent } from '../pages.component';

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  constructor(private backend: BackendService, 
              private page: PagesComponent){
    this.page.startLoading();
  }

  ngOnInit(): void {
    this.page.stopLoading();
  }

  access(){
    window.open('/access', '_blank');
  }

}
