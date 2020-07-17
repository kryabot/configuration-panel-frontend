import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {
  NbDialogService,
  NbMediaBreakpointsService,
  NbMenuService,
  NbSidebarService,
  NbThemeService,
} from '@nebular/theme';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { BackendService } from '../../../@core/data/backend.service';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('userSwitchDialog', { static: true }) userSwitchDialog: TemplateRef<any>;

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;
  sudoList: any;
  selectedSudo: any = null;

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
  ];

  currentTheme = 'dark';

  userMenu = [ /*{ title: 'Profile' },*/ { title: 'Log out' , link: 'auth/logout'} ];

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              private backend: BackendService,
              private breakpointService: NbMediaBreakpointsService,
              private dialogService: NbDialogService) {
  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);

      this.backend.getUserBasic()
      .subscribe((data: any) => {
        this.user = data.user;
        this.user.twitch_user = data.twitch_data;
        this.sudoList = data.sudo;
        if (this.sudoList) {
          if (this.sudoList.length === 1) {
            this.onTargetChange(this.sudoList[0]);
          } else if (this.sudoList.length > 1) {
            this.changeTarget(this.userSwitchDialog);
          } else {
            this.onTargetChange(this.user);
          }
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  changeTarget(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, {
      closeOnBackdropClick: false,
      closeOnEsc: false});
  }

  onTargetChange(target: any) {
    this.selectedSudo = target;
    this.setTarget(target.user_id);
    this.navigateHome();
  }

  setTarget(id) {
    localStorage.setItem('target_id', id);
  }
}
