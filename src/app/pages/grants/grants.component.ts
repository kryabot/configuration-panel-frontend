import { Component, Input } from '@angular/core';
import { BackendService } from '../../@core/data/backend.service';
import { PagesComponent } from '../pages.component';
import {LocalDataSource} from 'ng2-smart-table';
import {Permission} from '../../@core/model/Permission.model';
import {permissionSourceList, permissionTypeList, activeList} from '../lists.component';
import {AuthGuard} from '../../auth-guard.service';
import {DialogQuestionComponent} from '../../@theme/components';
import {NbDialogService, NbToastrService} from '@nebular/theme';

@Component({
  selector: 'ngx-grants',
  templateUrl: './grants.component.html',
})
export class GrantsComponent {
  permissions: Permission[];
  source: LocalDataSource = new LocalDataSource();

  settings = {
    mode: 'external',
    noDataMessage: 'No permissions yet...',
    hideSubHeader: true,
    pager: {
      display: true,
      perPage: 50,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    actions: {
      position: 'right',
      add: false,
      edit: false,
      delete: true,
    },
    columns: {
      type_source: {
        title: 'External source',
        editor: {
          type: 'list',
          config: {
            list: permissionSourceList,
          },
        },
        filter: {
          type: 'list',
          config: {
            list: permissionSourceList,
          },
        },
        valuePrepareFunction: (cell) => {
          return this.findTitleValueString(permissionSourceList, cell);
        },
      },
      type: {
        title: 'Permission usage',
        editor: {
          type: 'list',
          config: {
            list: permissionTypeList,
          },
        },
        filter: {
          type: 'list',
          config: {
            list: permissionTypeList,
          },
        },
        valuePrepareFunction: (cell) => {
          return this.findTitleValueString(permissionTypeList, cell);
        },
      },
      scope: {
        title: 'Scopes',
        type: 'string',
      },
      active: {
        title: 'Status',
        editor: {
          type: 'list',
          config: {
            list: activeList,
          },
        },
        filter: {
          type: 'list',
          config: {
            list: activeList,
          },
        },
        valuePrepareFunction: (cell) => {
          return this.findTitleValueNumber(activeList, cell);
        },
      },
    },
  };

  constructor(private backend: BackendService,
              private page: PagesComponent,
              private guard: AuthGuard,
              private dialogService: NbDialogService,
              private toastrService: NbToastrService) {
    this.initData();
  }

  findTitleValueNumber(list, cell): string {
    const status = list.find(x => x.value === Number(cell));
    if (status) return status.title;
    return '?';
  }

  findTitleValueString(list, cell): string{
    const status = list.find(x => x.value === cell);
    if (status) return status.title;
    return '?';
  }

  onRowSelect(event) {

  }

  deletePermission(event) {
    this.dialogService.open(DialogQuestionComponent)
      .onClose.subscribe((result: boolean) => {
        if (result) {
          this.deleteConfirmed(event);
        } else {
          event.confirm.reject();
        }
    });
  }

  private deleteConfirmed(event) {
    this.page.startLoading();
    this.backend.deletePermission(event.data.type).subscribe(resp => {
      this.page.stopLoading();
      this.guard.validateApiResponse(resp);
      this.toastrService.success('Permission deleted', 'Success');
      this.initData();
    },
      error => {
        this.page.stopLoading();
        if (error.status && error.status === 422) {
          this.toastrService.warning(error.error.error, 'Action failed');
        } else {
          this.toastrService.danger('This action not accessible now, try later', 'Server problem');
          console.log(error);
        }
      });
  }

  private pushData() {
    this.source = new LocalDataSource();
    this.permissions.forEach(row => {
      row.type_source = row.type;
    });
    this.source.load(this.permissions);
    this.source.setSort([{ field: 'active', direction: 'dsc' }]);
  }

  private initData() {
    this.page.startLoading();

    this.backend.getPermissions().subscribe((data: Permission[]) => {
      this.guard.validateApiResponse(data);
      this.permissions = data;

      this.pushData();
      this.page.stopLoading();
    });
  }
}
