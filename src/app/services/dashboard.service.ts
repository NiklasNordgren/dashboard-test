import { Injectable } from '@angular/core';
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
}
