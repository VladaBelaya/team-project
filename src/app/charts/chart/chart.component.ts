import {Component, Input} from '@angular/core';
import {ChartConfig} from "../../services/charts.service";

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent {
  @Input() chart!: ChartConfig;
}
