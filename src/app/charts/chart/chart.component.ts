import {Component, Input} from '@angular/core';
import {Data} from "../charts.component";

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent {
  @Input() chart!: Data;
}
