import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ChartsDirective} from "./charts.directive";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { ChartComponent } from './chart/chart.component';
import {ChartsComponent} from "./charts.component";
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [
  { path: '', component: ChartsComponent }
];



@NgModule({
  declarations: [
    ChartsDirective,
    ChartsComponent,
    ChartComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatProgressSpinnerModule
  ]
})
export class ChartsModule { }
