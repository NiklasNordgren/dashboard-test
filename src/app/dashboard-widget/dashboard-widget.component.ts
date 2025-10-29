import { Component, input, signal } from '@angular/core';
import { DashboardWidget } from '../models/dashboard-widget';
import { NgComponentOutlet } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { DashboardWidgetOptions } from '../dashboard-widget-options/dashboard-widget-options';

@Component({
  selector: 'app-dashboard-widget',
  imports: [NgComponentOutlet, MatButton, DashboardWidgetOptions, DashboardWidgetOptions],
  templateUrl: './dashboard-widget.component.html',
  styleUrl: './dashboard-widget.component.scss',
  host: {
    '[style.grid-area]': '"span " + (data().rows ?? 1) + "/ span " + (data().cols ?? 1)',
  },
})
export class DashboardWidgetComponent {
  data = input.required<DashboardWidget>();
  showOptions = signal(false);
}
