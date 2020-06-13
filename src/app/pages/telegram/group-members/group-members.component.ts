import { Component } from '@angular/core';
import { BackendService } from '../../../@core/data/backend.service';
import { takeWhile } from 'rxjs/internal/operators/takeWhile';
import { AuthGuard } from '../../../auth-guard.service';
import { PagesComponent } from '../../pages.component';
import { TgGroup } from '../../../@core/model/TgGroup.model';
import { TgMember } from '../../../@core/model/TgMember.model';
import { subTypeList } from '../../lists.component';
import { LocalDataSource } from 'ng2-smart-table';
import { forkJoin } from 'rxjs';
import { DialogQuestionComponent } from '../../../@theme/components';
import { NbDialogService } from '@nebular/theme';

@Component({
  selector: 'ngx-tg-group-members',
  styleUrls: ['./group-members.component.scss'],
  templateUrl: './group-members.component.html',
})
 
export class GroupMembersComponent {
    private alive = true;
    tggroup: TgGroup;
    tgmembers: TgMember[];
    memberSource: LocalDataSource = new LocalDataSource();

    counterTotal: number;
    counterVerified: number;
    counterSubs: number;
    counterDeleted: number;

    cleanSettings: CheckboxSetting[];

    memberTableConfig = {
        noDataMessage: 'It is your first time? Do not worry, it will not hurt. Just press refresh members button!',
        pager: {
          display: true,
          perPage: 50,
        },
        actions: {
            columnTitle: 'Edit',
            add: false,
            edit: false,
            delete: false,
            custom: [],
            position: 'left', // left|right
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
          tg_first_name: {
            title: 'First name',
            type: 'string',
          },

          tg_second_name: {
            title: 'Last name',
            type: 'string',
          },

          tg_username: {
            title: '@Username',
            type: 'string',
          },
          name: {
            title: 'Twitch name',
            type: 'string',
          },

          sub_type: {
            title: 'Subscriber',
            editor: {
              type: 'list',
              config: {
                list: subTypeList
              },
            },
            filter: {
              type: 'list',
              config: {
                list: subTypeList
              },
            },
            valuePrepareFunction: (cell) => {
              return this.findTitleValueString(subTypeList, cell);
            }
          },
        },
      };


    constructor(private backend: BackendService, 
                private guard: AuthGuard, 
                private page: PagesComponent,
                private dialogService: NbDialogService) {
        this.tgmembers = [];
        this.initCheckBox();
        this.recount();
        this.init();
    }

    initCheckBox(){
      this.cleanSettings = [
        this.createSetting('not_verified', 'user is not verified',  false),
        this.createSetting('not_sub', 'user is not a subscriber (includes not verified users)', false),
        this.createSetting('not_active', 'user telegram account is deleted', true),
      ];
    }
    init(background:boolean = false) {
        if(!background)
          this.page.startLoading();

        let groupReq = this.backend.getTgGroupMembers()
        let membersReq = this.backend.getTgGroup()

        forkJoin(groupReq, membersReq)
            .pipe(takeWhile(() => this.alive))
            .subscribe((data: any) => {
            if(!background)
              this.page.stopLoading();
            this.guard.validateApiResponse(data);
            this.tggroup = data[1];
            this.tgmembers = data[0];
            this.recount();
            this.pushData();

            if (this.isWaiting()){
              setTimeout(() => this.init(true), 2000);
            }
            });
    }
    createSetting(checkbox_key: string, checkbox_title: string, default_state: boolean): CheckboxSetting{
      return {
        key: checkbox_key,
        title: checkbox_title,
        iconClass: '3',
        type: 'warning',
        enabled: default_state,
      };;
    }

    refreshMembers(){
        if (this.isWaiting())
        return;

        this.page.startLoading();

        this.backend.hookMemberRefresh()
            .pipe(takeWhile(() => this.alive))
            .subscribe((data: any) => {
            this.guard.validateApiResponse(data);
            // this.tggroup = data;
            // this.tgmembers = [];
            // this.recount();
            // this.pushData();
            setTimeout( () => { this.init() }, 5000 );
            });

    }

    refreshPage(){
      if (!this.isWaiting()){
        this.page.stopLoading();
        return;
      }

      this.init(true);
    }

    private recount(){
        this.counterTotal = 0;
        this.counterVerified = 0;
        this.counterSubs = 0;
        this.counterDeleted = 0;
        
        for (let member of this.tgmembers) {
            this.counterTotal++;

            if(member.name != null && member.name.length > 0)
                this.counterVerified++;
            
            if(member.sub_type != null && member.sub_type.length > 0 && member.sub_type != 'no')
                this.counterSubs++;

            if(member.tg_first_name == '' && member.tg_second_name == '' && member.tg_username == '')
                this.counterDeleted++;
        }

    }
    private pushData(){
        this.memberSource = new LocalDataSource();
        this.memberSource.load(this.tgmembers);
      }

    ngOnDestroy(): void {
        this.alive = false;
    }

    findTitleValueString(list, cell): string{
        let status = list.find(x => x.value == cell);
        if(status) return status.title;
        return '?';
      }

    checkboxChange(changedKey: string, newValue: boolean){
        let existingItem = this.cleanSettings.find(x => x.key === changedKey);
        let index = this.cleanSettings.indexOf(existingItem);
        existingItem.enabled = newValue;
        this.cleanSettings[index] = existingItem;
    }

    isWaiting(): boolean{
      console.log(this.tggroup.refresh_status);
      return this.tggroup.refresh_status == 'WAIT';
    }
    massKick(){
      if (this.isWaiting())
        return;

      let allUnchecked = true;
      for (let setting of this.cleanSettings){
        if (setting.enabled) { allUnchecked = false; }
      }

      if (allUnchecked)
        return;


        this.dialogService.open(DialogQuestionComponent)
        .onClose.subscribe((result: boolean) => {
          if (result){
            this.page.startLoading();
            this.backend.hookMemberMassKick(this.cleanSettings)
            .subscribe((data: any) => {
              this.guard.validateApiResponse(data);
              setTimeout( () => { this.init() }, 4000 );
            }, error => {
              this.page.stopLoading();
            });
          }
        });
    }
}
