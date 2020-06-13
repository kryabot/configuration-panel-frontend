import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ngx-status-card',
  styleUrls: ['./status-card.component.scss'],
  template: `
    <nb-card (click)="onChange()" [ngClass]="{'off': !enabled}">
      <div class="icon-container">
        <div class="icon {{ type }}">
          <ng-content></ng-content>
        </div>
      </div>
      <div class="details">
        <div class="title">{{ title }}</div>
        <div class="status">{{ enabled ? 'Enabled' : 'Disabled' }}</div>
      </div>
    </nb-card>
  `,
})
export class StatusCardComponent {

  @Input() key: string;
  @Input() title: string;
  @Input() type: string;
  @Input() enabled = true;

  @Output() change = new EventEmitter<any>();

  onChange(){
    this.enabled = !this.enabled;
    this.change.emit(this);
  }
}