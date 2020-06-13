import { Component, ViewChild } from '@angular/core';
import { BackendService } from '../../../@core/data/backend.service';
import { takeWhile } from 'rxjs/internal/operators/takeWhile';
import { AuthGuard } from '../../../auth-guard.service';
import { PagesComponent } from '../../pages.component';
import { ReportStat } from '../../../@core/model/ReportStat';



@Component({
  selector: 'ngx-tg-group-stats',
  styleUrls: ['./stats.component.scss'],
  templateUrl: './stats.component.html',
})

export class GroupStatsComponent {
    private alive = true;


    messageRaw: ReportStat[] = [];
    joinRaw: ReportStat[] = [];
    kickRaw: ReportStat[] = [];
    subRaw: ReportStat[] = [];
    totalRaw: ReportStat[] = [];


    constructor(private backend: BackendService, 
                private guard: AuthGuard, 
                private page: PagesComponent) {
        
        this.init();
    }

    init() {
      this.page.startLoading();

      this.backend.getTgStats()
            .pipe(takeWhile(() => this.alive))
            .subscribe((data: any) => {
            this.guard.validateApiResponse(data);
            this.messageRaw = data.filter(data => data.type == 'message') as ReportStat[]
            this.joinRaw = data.filter(data => data.type == 'join') as ReportStat[]
            this.kickRaw = data.filter(data => data.type == 'kick') as ReportStat[]
            this.subRaw = data.filter(data => data.type == 'sub') as ReportStat[]
            this.totalRaw = data.filter(data => data.type == 'total') as ReportStat[]

            this.pushData();
            this.page.stopLoading();
            });
    }
    private pushData(){


    }

    ngOnDestroy(): void {
        this.alive = false;
    }

    
}
