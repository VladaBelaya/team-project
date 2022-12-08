import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NothingComponent } from './nothing/nothing.component';

const routes: Routes = [
  {
    path: 'table',
    loadChildren: () =>
      import('./table/table.module').then((m) => m.TableModule),
  },
  {
    path: 'charts',
    loadChildren: () =>
      import('./charts/charts.module').then((m) => m.ChartsModule),
  },
  {
    path: 'nothing',
    component: NothingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
