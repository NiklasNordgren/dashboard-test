import { Component, input } from '@angular/core';
import { DashboardWidget } from '../models/dashboard-widget';
import { NgComponentOutlet } from '@angular/common';

@Component({
  selector: 'app-dashboard-widget',
  imports: [NgComponentOutlet],
  templateUrl: './dashboard-widget.component.html',
  styleUrl: './dashboard-widget.component.scss',
})
export class DashboardWidgetComponent {
  data = input.required<DashboardWidget>();
}
