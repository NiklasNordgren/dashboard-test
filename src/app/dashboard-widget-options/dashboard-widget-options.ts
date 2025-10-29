import { Component, inject, input, model } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DashboardWidget } from '../models/dashboard-widget';
import { DashboardSerivce } from '../services/dashboard.service';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard-widget-options',
  imports: [MatButton, MatButtonToggleModule, MatIconButton, MatIconModule],
  templateUrl: './dashboard-widget-options.html',
  styleUrl: './dashboard-widget-options.scss',
})
export class DashboardWidgetOptions {
  data = input.required<DashboardWidget>();
  showOptions = model<boolean>(false);
  store = inject(DashboardSerivce);
}
