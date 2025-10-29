import { Type } from '@angular/core';

export interface DashboardWidget {
  id: number;
  title: string;
  content: Type<unknown>;
  rows?: number;
  cols?: number;
}
