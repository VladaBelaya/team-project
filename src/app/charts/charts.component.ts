import { Component } from '@angular/core';
import { delay, Observable, of, switchMap } from 'rxjs';
import { ChartConfig, ChartsService } from '../services/charts.service';
import { ActivatedRoute } from '@angular/router';

export interface Data {
  labels: number[];
  datasets: Datasets[];
}

interface Datasets {
  label: string;
  data: number[];
  fill?: boolean;
  borderColor?: string;
  tension?: number;
}

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
})
export class ChartsComponent {
  public charts$: Observable<[ChartConfig]> =
    this.activatedRoute.queryParams.pipe(
      switchMap(({ type, id }) => {
        if (type) {
          const paramsID =
            type === 'offices' ? `office_id=${id}` : `wh_id=${id}`;
          return this.chartsService.getChartById(type, paramsID);
        }
        return this.chartsService.charts$;
      }),
      delay(250)
    );

  constructor(
    private chartsService: ChartsService,
    private activatedRoute: ActivatedRoute
  ) {}
}
