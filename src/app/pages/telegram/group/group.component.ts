import { Component, OnInit, OnDestroy } from '@angular/core';
import { BackendService } from '../../../@core/data/backend.service';
import { takeWhile } from 'rxjs/internal/operators/takeWhile';
import { AuthGuard } from '../../../auth-guard.service';
import { PagesComponent } from '../../pages.component';
import { TgGroup } from '../../../@core/model/TgGroup.model';
import { NbDialogService, NbThemeService } from '@nebular/theme';
import { ReportStat } from '../../../@core/model/ReportStat';
import { DARK_THEME as baseTheme } from '@nebular/theme';

const colors = baseTheme.variables;

@Component({
  selector: 'ngx-tg-group',
  styleUrls: ['./group.component.scss'],
  templateUrl: './group.component.html',
})

export class GroupComponent implements OnInit, OnDestroy{
    private alive = true;
    tggroup: TgGroup;

    cardInvite: CardSetting = {
        key: 'share_join',
        title: 'Allow bot to give group invite link',
        iconClass: 'nb-paper-plane',
        type: 'warning',
        enabled: false,
      };

    cardSubOnly: CardSetting = {
        key: 'sub_only',
        title: 'Share invite link only to subscribers',
        iconClass: 'ion-cash',
        type: 'warning',
        enabled: false,
    };

    cardAllowPrime: CardSetting = {
        key: 'allow_prime',
        title: 'Twitch Prime is allowed subscribtion',
        iconClass: 'ion-magnet',
        type: 'warning',
        enabled: false,
    };

    cardAutoKick: CardSetting = {
        key: 'auto_kick',
        title: 'Allow bot to auto kick joined user who does not match criteria',
        iconClass: 'ion-magnet',
        type: 'warning',
        enabled: false,
    };

    cardList: CardSetting[] = [
        this.cardInvite,
        this.cardSubOnly,
        this.cardAutoKick,
        //this.cardAllowPrime,
      ];

    colorScheme: any;
    themeSubscription: any;
    userReportData = [];
    lastReportDate: any;

    single = [];
    pieView = [600, 200];

    constructor(private backend: BackendService, 
                private guard: AuthGuard, 
                private page: PagesComponent,
                private dialogService: NbDialogService,
                private theme: NbThemeService) {
        this.page.startLoading();

        this.colorScheme = {
            domain: [colors.successLight, colors.warningLight, colors.primaryLight]
          };

          this.setData()
    }
    setData(){

        this.single = [
            {
              name: '-',
              value: 0,
            },
            {
              name: '-',
              value: 0,
            },
            {
              name: '-',
              value: 0,
            },
          ];
    }
    ngOnInit() {
        this.page.startLoading();

        // setTimeout(() => this.setData(), 1000);

        this.backend.getTgGroup()
            .pipe(takeWhile(() => this.alive))
            .subscribe((data: any) => {
            this.page.stopLoading();
            this.guard.validateApiResponse(data);
            this.tggroup = data;
            this.mapCardValues();
            }, error => {
                console.log(error)
                this.page.stopLoading();
            });
        
        this.backend.getTgLastUserReport()
        .pipe(takeWhile(() => this.alive))
        .subscribe((data: any) => {
            this.guard.validateApiResponse(data);
            let rows = data as ReportStat[];

            let tmp = []
            rows.forEach((row: ReportStat) => {
                this.lastReportDate = row.when_dt
                if(['sub', 'nonsub', 'bots'].includes(row.type)){
                    let d = {
                        name: this.translateKey(row.type), 
                        value: row.counter
                    }
                    tmp.push(d);
                }
            });
            this.single = tmp
            }, error => {
                console.log(error)
            });
    }

    translateKey(key: string): string{
        if (key == 'sub') return 'Subscribers'
        if (key == 'nonsub') return 'Non-subscribers'
        if (key == 'bots') return 'Bots'
        return key
    }
    mapCardValues(){
        this.cardInvite.enabled = this.tggroup.enabled_join;
        this.cardSubOnly.enabled = this.tggroup.join_sub_only;
        this.cardAllowPrime.enabled = this.tggroup.allow_prime;
        this.cardAutoKick.enabled = this.tggroup.auto_kick;
    }

    ngOnDestroy(): void {
        this.alive = false;
    }

    cardClick(event){
        if(event.key == this.cardInvite.key)
            this.tggroup.enabled_join = event.enabled;

        if(event.key == this.cardSubOnly.key)
            this.tggroup.join_sub_only = event.enabled;
        
        if(event.key == this.cardAllowPrime.key)
            this.tggroup.allow_prime = event.enabled;

        if(event.key == this.cardAutoKick.key)
            this.tggroup.auto_kick = event.enabled;

        this.mapCardValues();


        this.page.startLoading();
        this.backend.saveTgGroup(this.tggroup)
        .subscribe((response: any) => {
            this.page.stopLoading();
            this.guard.validateApiResponse(response);
            this.tggroup = response;
        });
    }

    saveLink(event){
        let link:any[] = event.split('chat/');
        let newLink = link[link.length - 1];
        this.tggroup.link_changed = this.tggroup.join_link != newLink;
        this.tggroup.join_link = newLink;
        this.save();
    }

    save(){
        this.page.startLoading();
        this.backend.saveTgGroup(this.tggroup)
        .subscribe((response: any) => {
            this.page.stopLoading();
            this.guard.validateApiResponse(response);
            this.tggroup = response;
        }, error =>{
            console.log(error)
        });
    }

    isEnabledAutomatedMassKick(): boolean{
        if (!this.tggroup || this.tggroup == null) { return false }
        return this.tggroup.auto_mass_kick > 0
    }
}
