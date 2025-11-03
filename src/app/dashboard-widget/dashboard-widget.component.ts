import { Component, input, signal, inject, output, computed } from '@angular/core';
import { DashboardWidget } from '../models/dashboard-widget';
import { NgComponentOutlet } from '@angular/common';
import { DashboardWidgetOptions } from '../dashboard-widget-options/dashboard-widget-options';
import { MatIcon } from '@angular/material/icon';
import { DragDropModule } from 'primeng/dragdrop';
import { DashboardSerivce } from '../services/dashboard.service';

@Component({
  selector: 'app-dashboard-widget',
  imports: [
    NgComponentOutlet,
    DashboardWidgetOptions,
    DashboardWidgetOptions,
    MatIcon,
    DragDropModule,
  ],
  templateUrl: './dashboard-widget.component.html',
  styleUrl: './dashboard-widget.component.scss',
  host: {
    '[style.grid-area]': 'gridArea()',
  },
})
export class DashboardWidgetComponent {
  private store = inject(DashboardSerivce);

  // Compute effective column span based on available columns
  private effectiveColSpan = computed(() => {
    const requestedCols = this.data().cols ?? 1;
    const availableCols = this.store.columns();
    return requestedCols >= availableCols ? availableCols : requestedCols;
  });

  // Compute grid-area value
  gridArea = computed(() => {
    const rowSpan = this.data().rows ?? 1;
    return `span ${rowSpan} / span ${this.effectiveColSpan()}`;
  });
  data = input.required<DashboardWidget>();
  showOptions = signal(false);
  onDragStart = output<any>();
  onDragEnd = output<any>();
}
