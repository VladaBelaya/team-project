import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableComponent } from "./table/table.component";
import {ChartsComponent} from "./charts/charts.component";

const routes: Routes = [
  { path: 'table', component: TableComponent },
  { path: 'charts', component: ChartsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
