import { Component, ElementRef, inject, viewChild, OnDestroy, effect, signal } from '@angular/core';
import { DashboardWidgetComponent } from '../dashboard-widget/dashboard-widget.component';
import { DashboardSerivce } from '../services/dashboard.service';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { wrapGrid } from 'animate-css-grid';
import { DragDropModule } from 'primeng/dragdrop';
import { DashboardWidget } from '../models/dashboard-widget';

@Component({
  selector: 'app-dashboard',
  imports: [DashboardWidgetComponent, MatButtonModule, MatMenuModule, DragDropModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnDestroy {
  store = inject(DashboardSerivce);
  dashboard = viewChild.required<ElementRef>('dashboard');

  private gridAnimation?: ReturnType<typeof wrapGrid>;
  private resizeObserver?: ResizeObserver;

  ngOnInit() {
    this.gridAnimation = wrapGrid(this.dashboard().nativeElement, {
      duration: 300,
    });

    // Set up resize observer for dynamic column calculation
    this.resizeObserver = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      const minColWidth = 200; // Minimum width for each column
      const maxCols = 8; // Maximum number of columns
      const calculatedCols = Math.min(Math.floor(width / minColWidth), maxCols);
      this.store.columns.set(Math.max(1, calculatedCols));
    });

    this.resizeObserver.observe(this.dashboard().nativeElement);
  }

  private draggedWidget?: DashboardWidget;
  isDragging = signal(false);

  onDragStart(event: any) {
    const widgetElement = event.target.closest('[data-widget-id]');
    if (!widgetElement) return;

    const widgetId = parseInt(widgetElement.dataset.widgetId);
    this.draggedWidget = this.store.addedWidgets().find((w) => w.id === widgetId);
    this.isDragging.set(true);
  }

  onDragEnd(event: any) {
    this.draggedWidget = undefined;
    this.isDragging.set(false);
  }

  onDrop(event: any) {
    if (!this.draggedWidget) return;

    const dropElement = event.target.closest('[data-widget-id]');
    if (!dropElement) return;

    const dropId = dropElement.dataset.widgetId;
    if (dropId === 'dummy') return; // Let onDropFullWidth handle this

    const dropIndex = this.store.addedWidgets().findIndex((w) => w.id === parseInt(dropId));
    const dragIndex = this.store.addedWidgets().findIndex((w) => w.id === this.draggedWidget?.id);

    if (dragIndex !== -1 && dropIndex !== -1 && dragIndex !== dropIndex) {
      const widgets = [...this.store.addedWidgets()];
      const [removed] = widgets.splice(dragIndex, 1);
      widgets.splice(dropIndex, 0, removed);
      this.store.addedWidgets.set(widgets);
    }
  }

  onDropFullWidth(event: any) {
    if (!this.draggedWidget) return;

    const dragIndex = this.store.addedWidgets().findIndex((w) => w.id === this.draggedWidget?.id);
    if (dragIndex === -1) return;

    // Create a new widget array with the dragged widget at the end and set to full width
    const widgets = [...this.store.addedWidgets()];
    const [removed] = widgets.splice(dragIndex, 1);
    this.store.removeWidget(removed.id);

    // Create a new widget object to trigger reactivity
    const updatedWidget = {
      ...removed,
      cols: this.store.columns(), // Set to current column count for full width
    };

    this.store.addWidget(updatedWidget);
  }

  ngOnDestroy(): void {
    this.gridAnimation?.unwrapGrid();
    this.resizeObserver?.disconnect();
  }
}
