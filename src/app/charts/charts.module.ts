import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ChartsDirective} from "./charts.directive";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { ChartComponent } from './chart/chart.component';
import {ChartsComponent} from "./charts.component";



@NgModule({
  declarations: [
    ChartsDirective,
    ChartsComponent,
    ChartComponent
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ]
})
export class ChartsModule { }
