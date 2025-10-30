import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { DashboardWidgetComponent } from '../dashboard-widget/dashboard-widget.component';
import { DashboardSerivce } from '../services/dashboard.service';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { wrapGrid } from 'animate-css-grid';

@Component({
  selector: 'app-dashboard',
  imports: [DashboardWidgetComponent, MatButtonModule, MatMenuModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  store = inject(DashboardSerivce);
  dashboard = viewChild.required<ElementRef>('dashboard');

  ngOnInit() {
    wrapGrid(this.dashboard().nativeElement, {
      duration: 300,
    });
  }
}
