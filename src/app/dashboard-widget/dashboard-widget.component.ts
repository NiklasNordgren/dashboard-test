import { Component, input, signal, inject, ElementRef, effect, output, EventEmitter } from '@angular/core';
import { DashboardWidget } from '../models/dashboard-widget';
import { DashboardSerivce } from '../services/dashboard.service';
import { NgComponentOutlet } from '@angular/common';
import { DashboardWidgetOptions } from '../dashboard-widget-options/dashboard-widget-options';
import { MatIcon } from '@angular/material/icon';
import { DragDropModule } from 'primeng/dragdrop';

@Component({
  selector: 'app-dashboard-widget',
  imports: [NgComponentOutlet, DashboardWidgetOptions, DashboardWidgetOptions, MatIcon, DragDropModule],
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
  onDragStart = output<any>();
  onDragEnd = output<any>();
  private store: DashboardSerivce = inject(DashboardSerivce);
  private el = inject(ElementRef<HTMLElement>);

  constructor() {
    // Keep the parent wrapper (if any) and the host element styles in sync
    // with the widget settings and runtime column count. This ensures that
    // when animation libraries wrap items we still apply grid placement to
    // the actual grid child (the wrapper) so full-span widgets truly span
    // the full width.
    effect(() => {
      const colsRequested = this.data().cols ?? 1;
      const rows = this.data().rows ?? 1;
      const available = this.store.columns() ?? 1;

      // When cols match available columns or exceed them, span all columns using
      // explicit start/end positions instead of spans to ensure reliable width
      const gridColumn =
        colsRequested >= available
          ? '1 / -1' // span full width
          : `span ${Math.min(colsRequested, available)}`; // limit span to available
      const gridRow = 'span ' + rows;

      const hostEl = this.el.nativeElement as HTMLElement;
      // Apply to wrapper (parent) if present — animate-css-grid wraps each
      // child in an element, so the wrapper is typically the grid item.
      const parent = hostEl.parentElement as HTMLElement | null;
      if (parent) {
        parent.style.gridColumn = gridColumn;
        parent.style.gridRow = gridRow;
      }

      // Also apply to the host as a fallback when no wrapper exists.
      hostEl.style.gridColumn = gridColumn;
      hostEl.style.gridRow = gridRow;
    });
  }

  // gridColumn spans are computed using the widget `cols` value.
  // If a widget requests to be "Full" (we use 0 as the 'full' sentinel
  // in the options), we substitute the current number of visible columns
  // from the store so the widget will span the entire row.
  get gridColumn() {
    const colsRequested = this.data().cols ?? 1;
    // When the user selects the maximum available columns (e.g., selecting 8 when
    // there are 8 columns), use grid-column: 1 / -1 to guarantee a full span.
    // Otherwise use span N for explicit column counts. This ensures that selecting
    // the max value from columnsRange truly spans all columns.
    const available = this.store.columns() ?? 1;
    if (colsRequested === available) {
      return '1 / -1';
    }

    const span = Math.max(1, colsRequested);
    return 'span ' + span;
  }

  get gridRow() {
    return 'span ' + (this.data().rows ?? 1);
  }
}
