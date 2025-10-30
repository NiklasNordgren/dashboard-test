import { computed, effect, Injectable } from '@angular/core';
import { signal } from '@angular/core';
import { DashboardWidget } from '../models/dashboard-widget';
import { Subscribers } from '../subscribers/subscribers';
import { Views } from '../views/views';
import { WatchTime } from '../watch-time/watch-time';
import { Revenue } from '../revenue/revenue';
import { Analytics } from '../analytics/analytics';

@Injectable({
  providedIn: 'root',
})
export class DashboardSerivce {
  columns = signal<number>(1);

  widgets = signal<DashboardWidget[]>([
    {
      id: 1,
      title: 'Sample DashboardWidget',
      content: Subscribers,
      rows: 2,
      cols: 2,
      backgroundColor: 'gray',
      color: 'whitesmoke',
    },
    {
      id: 2,
      title: 'Another DashboardWidget',
      content: Views,
      backgroundColor: 'gray',
    },
    {
      id: 3,
      title: 'Sample DashboardWidget',
      content: Subscribers,
      backgroundColor: 'gray',
      rows: 2,
      cols: 2,
    },
    {
      id: 4,
      title: 'Another DashboardWidget',
      content: Views,
      backgroundColor: 'gray',
      color: 'whitesmoke',
    },
    {
      id: 5,
      title: 'Watch Time',
      content: WatchTime,
      backgroundColor: 'gray',
      rows: 2,
      cols: 2,
    },
    {
      id: 6,
      title: 'Revenue',
      content: Revenue,
      backgroundColor: 'gray',
      color: 'whitesmoke',
    },
    {
      id: 7,
      title: 'Analytics',
      content: Analytics,
      backgroundColor: 'black',
      color: 'aquamarine',
    },
  ]);

  addedWidgets = signal<DashboardWidget[]>([]);

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

  removeWidget(id: number) {
    const newWidgets = this.addedWidgets().filter((w) => w.id !== id);
    this.addedWidgets.set(newWidgets);
  }

  constructor() {
    this.fetchWidgets();
  }

  saveWidgets = effect(() => {
    const widgetsWithoutContent: Partial<DashboardWidget>[] = this.addedWidgets().map((w) => ({
      ...w,
    }));
    widgetsWithoutContent.forEach((w) => delete w.content);
    localStorage.setItem('dashboard-widgets', JSON.stringify(widgetsWithoutContent));
  });

  fetchWidgets() {
    const widgetsJson = localStorage.getItem('dashboard-widgets');
    if (widgetsJson) {
      const widgets = JSON.parse(widgetsJson) as DashboardWidget[];
      widgets.forEach((widget) => {
        const content = this.widgets().find((w) => widget.id === w.id)?.content;
        if (content) {
          widget.content = content;
        }
      });
      this.addedWidgets.set(widgets);
    }
  }
}
