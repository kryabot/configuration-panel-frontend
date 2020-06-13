import { Component, TemplateRef } from '@angular/core';
import { BackendService } from '../../../@core/data/backend.service';
import { takeWhile } from 'rxjs/internal/operators/takeWhile';
import { AuthGuard } from '../../../auth-guard.service';
import { PagesComponent } from '../../pages.component';
import { LocalDataSource } from 'ng2-smart-table';
import { NbDialogService } from '@nebular/theme';
import { DialogQuestionComponent } from '../../../@theme/components/modal/question-dialog/question-dialog.component';
import { texts } from '../../lists.component';
import { DatePipe } from '@angular/common';
import { BannedMedia } from '../../../@core/model/BannedMedia';

@Component({
  selector: 'ngx-tg-banned-media',
  styleUrls: ['./banned-media.component.scss'],
  templateUrl: './banned-media.component.html',
})

export class BannedMediaComponent {
    private alive = true;
    medias: BannedMedia[];
    mediaSource: LocalDataSource = new LocalDataSource();
    alerts: any[];

    mediaTableConfig = {
        noDataMessage: 'You do not have any banned media!',
        hideSubHeader: true,
        pager: {
          display: true,
          perPage: 50,
        },
        actions: {
            columnTitle: '',
            add: false,
            edit: false,
            delete: true,
            custom: [],
            position: 'right', // left|right
          },
        delete: {
          deleteButtonContent: '<i class="nb-trash"></i>',
          confirmDelete: true,
        },
        columns: {
          media_type: {
            title: 'Media type',
            type: 'string',
          },
          media_id: {
            title: 'Media ID',
            type: 'string',
          },
          about: {
            title: 'Description',
            type: 'string',
            valuePrepareFunction: (val) => {
              if (val) {
                return val
              }
                return 'Not provided';
              }
          },
          name: {
            title: 'Banned by',
            type: 'string',
            valuePrepareFunction: (val) => {
              if (val) {
                return val
              }
                return 'KryaBot';
              }
          },
          ban_ts: {
            title: 'Banned at',
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
        this.medias = [];
        this.alerts = [];
        this.init();
    }

    init() {
      this.page.startLoading();

      this.backend.getBannedMedia()
            .pipe(takeWhile(() => this.alive))
            .subscribe((data: any) => {
            this.page.stopLoading();
            this.guard.validateApiResponse(data);
            this.medias = data as BannedMedia[];
            this.pushData();
            });
    }
    private pushData(){
        this.mediaSource = new LocalDataSource();
        this.mediaSource.load(this.medias);
        this.mediaSource.setSort([{ field: 'ban_ts', direction: 'desc' }]);
      }

    ngOnDestroy(): void {
        this.alive = false;
    }

    onDeleteConfirm(event): void {
      this.alerts = [];
      this.dialogService.open(DialogQuestionComponent)
        .onClose.subscribe((result: boolean) => {
          this.deleteCondifmed(event, result);
        });
    }

    deleteCondifmed(event, result){
      if(result){
        this.page.startLoading();
        this.backend.deleteBannedMedia(event.data as BannedMedia)
        .subscribe((resp: any) => {
          this.createAlert('success', `Media successfully unbanned!`);
          event.confirm.resolve();
          this.page.stopLoading();
        }, error => {
          event.confirm.reject();
          this.createAlert('warning', `You broke something again...`);
          this.createAlert('danger', `Error from backend: ${error.statusText} (${error.status})`);
          this.page.stopLoading();
        });
      }
      else {
        event.confirm.reject();
      }

    }

  private createAlert(alertType:string, alertText: string){
    let alert = {size: 'xxsmall', status: alertType, message: alertText};
    this.alerts.push(alert);
  }

  onAlertClose(alert){
    this.alerts = this.alerts.filter(x => x != alert);
  }

  help(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog);
  }

  unbanAll(){
    this.alerts = [];
    this.dialogService.open(DialogQuestionComponent)
    .onClose.subscribe((result: boolean) => {
      if (result){
        this.page.startLoading();
        this.backend.deleteAllBannedMedia()
        .subscribe((resp: any) => {
          this.createAlert('success', `Unbanned all medias!`);
          this.medias = []
          this.pushData();
          this.page.stopLoading();
        }, error => {
          this.createAlert('warning', `You broke something again...`);
          this.createAlert('danger', `Error from backend: ${error.statusText} (${error.status})`);
          this.page.stopLoading();
        });
      }
    });
  }
}
