import { Component, input, signal, inject, ElementRef, effect } from '@angular/core';
import { DashboardWidget } from '../models/dashboard-widget';
import { DashboardSerivce } from '../services/dashboard.service';
import { NgComponentOutlet } from '@angular/common';
import { DashboardWidgetOptions } from '../dashboard-widget-options/dashboard-widget-options';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard-widget',
  imports: [NgComponentOutlet, DashboardWidgetOptions, DashboardWidgetOptions, MatIcon],
  templateUrl: './dashboard-widget.component.html',
  styleUrl: './dashboard-widget.component.scss',
  host: {
    '[style.gridColumn]': 'gridColumn',
    '[style.gridRow]': 'gridRow',
  },
})
export class DashboardWidgetComponent {
  data = input.required<DashboardWidget>();
  showOptions = signal(false);
  private store: DashboardSerivce = inject(DashboardSerivce);
  private el = inject(ElementRef<HTMLElement>);

  constructor() {
    // Apply grid placement to both wrapper and host element to handle animation library wrapping
    effect(() => {
      const gridColumn = this.gridColumn;
      const gridRow = this.gridRow;
      const hostEl = this.el.nativeElement;
      const parent = hostEl.parentElement;
      
      if (parent) parent.style.cssText = `grid-column: ${gridColumn}; grid-row: ${gridRow};`;
      hostEl.style.cssText = `grid-column: ${gridColumn}; grid-row: ${gridRow};`;
    });
  }

  // gridColumn spans are computed using the widget `cols` value.
  // If a widget requests to be "Full" (we use 0 as the 'full' sentinel
  // in the options), we substitute the current number of visible columns
  // from the store so the widget will span the entire row.
  get gridColumn() {
    const cols = this.data().cols ?? 1;
    // Use 1 / -1 for max width to guarantee full span
    return cols >= (this.store.columns() ?? 1) ? '1 / -1' : `span ${cols}`;
  }

  get gridRow() {
    return `span ${this.data().rows ?? 1}`;
  }
}
