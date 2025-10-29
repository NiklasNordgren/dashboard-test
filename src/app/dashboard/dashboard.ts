import { Component, inject } from '@angular/core';
import { DashboardWidgetComponent } from '../dashboard-widget/dashboard-widget.component';
import { DashboardSerivce } from '../services/dashboard.service';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-dashboard',
  imports: [DashboardWidgetComponent, MatButtonModule, MatMenuModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  store = inject(DashboardSerivce);
}
