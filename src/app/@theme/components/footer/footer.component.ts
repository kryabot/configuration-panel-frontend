import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
  <span class="created-by">Created with ♥</span>
    <div class="socials">
      <a href="https://twitch.tv" target="_blank" class="ion ion-social-twitch"></a>
    </div>
  `,
})
export class FooterComponent {
}
