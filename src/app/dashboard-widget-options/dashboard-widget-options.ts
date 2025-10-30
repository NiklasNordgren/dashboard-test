import { Component, inject, input, model } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DashboardWidget } from '../models/dashboard-widget';
import { DashboardSerivce } from '../services/dashboard.service';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard-widget-options',
  imports: [MatButtonToggleModule, MatIconButton, MatIconModule],
  templateUrl: './dashboard-widget-options.html',
  styleUrl: './dashboard-widget-options.scss',
})
export class DashboardWidgetOptions {
  data = input.required<DashboardWidget>();
  showOptions = model<boolean>(false);
  store = inject(DashboardSerivce);

  get columnsRange(): number[] {
    const cols = Math.max(1, this.store.columns());
    return Array.from({ length: cols }, (_, i) => i + 1);
  }
}
