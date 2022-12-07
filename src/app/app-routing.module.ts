import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableComponent } from "./table/table.component";
import {ChartsComponent} from "./charts/charts.component";

const routes: Routes = [
  // {
  //  path: 'data',
// loadChildren: () => import('./data/data.module').then(m => m.DataModule)
  //},
  //{
  //  path: 'graphs',
//  loadChildren: () => import('./graphs/graphs.module').then(m => m.GraphsModule)
  //},
  { path: 'table', component: TableComponent },
  { path: 'charts', component: ChartsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
