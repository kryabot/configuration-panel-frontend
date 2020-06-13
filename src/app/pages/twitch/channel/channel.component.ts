import { Component, OnInit, OnDestroy } from '@angular/core';
import { BackendService } from '../../../@core/data/backend.service';
import { Channel } from '../../../@core/model/Channel.model';
import { takeWhile } from 'rxjs/internal/operators/takeWhile';
import { AuthGuard } from '../../../auth-guard.service';
import { PagesComponent } from '../../pages.component';

interface CardSettings {
    key: string;
    title: string;
    iconClass: string;
    type: string;
    enabled: boolean;
  }


@Component({
  selector: 'ngx-dashboard',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss'],
})

export class ChannelComponent implements OnInit, OnDestroy{
    private alive = true;
    channel: Channel;

    cardBot: CardSettings = {
        key: 'autojoin',
        title: 'KryaBot',
        iconClass: 'nb-power-circled',
        type: 'warning',
        enabled: false,
      };

    cardIrc: CardSettings = {
        key: 'saveirc',
        title: 'Save chat history',
        iconClass: 'nb-cloudy',
        type: 'warning',
        enabled: false,
    };

    statusCards: CardSettings[] = [
        this.cardBot,
        this.cardIrc,
      ];


    constructor(private backend: BackendService, private guard: AuthGuard, private page: PagesComponent) {
        this.page.startLoading();
    }
    ngOnInit() {
        // this.page.startLoading();
        this.backend.getChannel()
            .pipe(takeWhile(() => this.alive))
            .subscribe((data: any) => {
            this.page.stopLoading();
            this.guard.validateApiResponse(data);
            this.channel = data;
            this.cardBot.enabled = this.channel.auto_join;
            
            });
    }

    ngOnDestroy(): void {
        this.alive = false;
    }

    cardClick(event){
        if(event.key == 'autojoin') this.channel.auto_join = event.enabled
        // if(event.key == 'saveirc') this.channel.save_irc = event.enabled
        this.page.startLoading();
        this.backend.saveChannel(this.channel)
        .subscribe((response : any) => {
            this.page.stopLoading();
            this.guard.validateApiResponse(response);
            this.channel = response;
        });
    }
}
