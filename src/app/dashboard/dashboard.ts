import { Component, inject } from '@angular/core';
import { DashboardWidgetComponent } from '../dashboard-widget/dashboard-widget.component';
import { DashboardSerivce } from '../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  imports: [DashboardWidgetComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  store = inject(DashboardSerivce);
}
