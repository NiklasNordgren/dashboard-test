import { computed, Injectable } from '@angular/core';
import { signal } from '@angular/core';
import { DashboardWidget } from '../models/dashboard-widget';
import { Subscribers } from '../subscribers/subscribers';
import { Views } from '../views/views';

@Injectable({
  providedIn: 'root',
})
export class DashboardSerivce {
  widgets = signal<DashboardWidget[]>([
    {
      id: 1,
      title: 'Sample DashboardWidget',
      content: Subscribers,
    },
    {
      id: 2,
      title: 'Another DashboardWidget',
      content: Views,
    },
  ]);

  addedWidgets = signal<DashboardWidget[]>([
    {
      id: 1,
      title: 'Sample DashboardWidget',
      content: Subscribers,
      rows: 2,
      cols: 2,
    },
    {
      id: 2,
      title: 'Another DashboardWidget',
      content: Views,
    },
    {
      id: 3,
      title: 'Sample DashboardWidget',
      content: Subscribers,
      rows: 2,
      cols: 2,
    },
    {
      id: 4,
      title: 'Another DashboardWidget',
      content: Views,
    },
  ]);

  widgetsToAdd = computed(() => {
    const addedIds = this.addedWidgets().map((w) => w.id);
    return this.widgets().filter((w) => !addedIds.includes(w.id));
  });

  addWidget(widget: DashboardWidget) {
    this.addedWidgets.set([...this.addedWidgets(), { ...widget }]);
  }

  updateWidget(id: number, widget: Partial<DashboardWidget>) {
    const index = this.addedWidgets().findIndex((w) => w.id === id);
    if (index !== -1) {
      const newWidgets = [...this.addedWidgets()];
      newWidgets[index] = { ...newWidgets[index], ...widget };
      this.addedWidgets.set(newWidgets);
    }
  }

  moveWidgetToRight(id: number) {
    const index = this.addedWidgets().findIndex((w) => w.id === id);
    if (index === this.addedWidgets().length - 1) return;

    const newWidgets = [...this.addedWidgets()];
    [newWidgets[index], newWidgets[index + 1]] = [
      { ...newWidgets[index + 1] },
      { ...newWidgets[index] },
    ];

    this.addedWidgets.set(newWidgets);
  }

  moveWidgetToLeft(id: number) {
    const index = this.addedWidgets().findIndex((w) => w.id === id);
    if (index === 0) return;

    const newWidgets = [...this.addedWidgets()];
    [newWidgets[index], newWidgets[index - 1]] = [
      { ...newWidgets[index - 1] },
      { ...newWidgets[index] },
    ];

    this.addedWidgets.set(newWidgets);
  }
}
