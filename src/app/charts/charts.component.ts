import { Component } from '@angular/core';
import {delay, Observable} from "rxjs";
import {ChartConfig, ChartsService} from "../services/charts.service";

export interface Data {
  labels: number[],
  datasets: Datasets[]
}

interface Datasets {
  label: string,
  data: number[],
  fill?: boolean,
  borderColor?: string,
  tension?: number
}
@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})

export class ChartsComponent {
  public charts$: Observable<[ChartConfig]> = this.chartsService.charts$.pipe(delay(750));
  constructor(private chartsService: ChartsService) {}

}
