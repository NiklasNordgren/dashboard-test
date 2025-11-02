import { Component, ElementRef, inject, viewChild, OnDestroy, effect } from '@angular/core';
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
  private resizeObserver?: ResizeObserver;
  private resizeTimeout?: number;
  private computeTimeout?: number;
  private computeColumnsFunc?: () => void;

  private gridAnimation?: ReturnType<typeof wrapGrid>;

  constructor() {
    // Re-compute columns whenever widgets are updated, but with a shorter delay
    effect(() => {
      // Access addedWidgets to subscribe to changes

      this.store.addedWidgets();
      // Use a very short timeout to let animate-css-grid initialize its mutation observer
      if (this.computeTimeout) {
        clearTimeout(this.computeTimeout);
      }
      this.computeTimeout = setTimeout(() => this.computeColumnsFunc?.(), 250) as unknown as number;
    });
  }

  ngOnInit() {
    this.gridAnimation = wrapGrid(this.dashboard().nativeElement, {
      duration: 300,
    });

    // Compute how many columns fit in the container based on the min column width
    // Read the CSS variable --min-col-width from the element so JS and CSS agree.
    const el = this.dashboard().nativeElement as HTMLElement;
    const parsePx = (v: string, fallback = 200) => {
      if (!v) return fallback;
      const m = v.trim().match(/^([0-9\.]+)px$/);
      return m ? Math.round(Number(m[1])) : fallback;
    };

    this.computeColumnsFunc = () => {
      const styles = getComputedStyle(el);
      const minColWidth = 200;
      const gap =
        parsePx(styles.getPropertyValue('gap')) ||
        parsePx(styles.getPropertyValue('column-gap')) ||
        0;

      // Account for container padding since grid tracks are laid out inside the
      // inner content area. clientWidth includes padding, so subtract left/right
      // padding to get the space available for grid tracks.
      const padLeft = parsePx(styles.getPropertyValue('padding-left')) || 0;
      const padRight = parsePx(styles.getPropertyValue('padding-right')) || 0;
      const availableWidth = Math.max(
        0,
        (el.clientWidth || el.getBoundingClientRect().width) - padLeft - padRight
      );

      // For N columns we need: N*min + (N-1)*gap <= availableWidth
      // => N <= (availableWidth + gap) / (min + gap)
      // We calculate the maximum possible columns that could fit
      const maxCols = Math.max(1, Math.floor((availableWidth + gap) / (minColWidth + gap)));

      // Update both the service signal and the CSS variable
      // We use maxCols as both the maximum and actual column count
      // This ensures when a widget requests maxCols, it gets full width
      this.store.columns.set(maxCols);
    };

    const debouncedCompute = () => {
      if (this.resizeTimeout) {
        clearTimeout(this.resizeTimeout);
      }
      // Use a short timeout for resize to avoid jerky animations
      this.resizeTimeout = setTimeout(() => this.computeColumnsFunc?.(), 100) as unknown as number;
    };

    // Initial compute and observe resizes
    this.computeColumnsFunc();
    this.resizeObserver = new ResizeObserver(() => debouncedCompute());
    this.resizeObserver.observe(el);
  }

  private draggedWidget?: DashboardWidget;

  onDragStart(event: any) {
    const widgetElement = event.target.closest('[data-widget-id]');
    if (!widgetElement) return;
    
    const widgetId = parseInt(widgetElement.dataset.widgetId);
    this.draggedWidget = this.store.addedWidgets().find(w => w.id === widgetId);
  }

  onDragEnd(event: any) {
    this.draggedWidget = undefined;
  }

  onDrop(event: any) {
    if (!this.draggedWidget) return;
    
    const dropElement = event.target.closest('[data-widget-id]');
    if (!dropElement) return;
    
    const dropId = parseInt(dropElement.dataset.widgetId);
    const dropIndex = this.store.addedWidgets().findIndex(w => w.id === dropId);
    const dragIndex = this.store.addedWidgets().findIndex(w => w.id === this.draggedWidget?.id);
    
    if (dragIndex !== -1 && dropIndex !== -1 && dragIndex !== dropIndex) {
      const widgets = [...this.store.addedWidgets()];
      const [removed] = widgets.splice(dragIndex, 1);
      widgets.splice(dropIndex, 0, removed);
      this.store.addedWidgets.set(widgets);
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    if (this.computeTimeout) {
      clearTimeout(this.computeTimeout);
    }
    this.gridAnimation?.unwrapGrid();
  }
}
