import {Component, Inject} from '@angular/core';
import {delay, Observable, switchMap} from 'rxjs';
import {ChartConfig, ChartsService} from '../services/charts.service';
import {ActivatedRoute} from '@angular/router';

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
  providers: [ChartsService]
})
export class ChartsComponent {
  public charts$: Observable<ChartConfig[]> =
    this.activatedRoute.queryParams.pipe(
      switchMap(({type, id, from = '', to = ''}) => {
        if (type) {
          let paramsID =
            type === 'offices' ? `office_id=${id}` : `wh_id=${id}`;
          if(from) {
            paramsID += `&dt_date_gte=${from}`
          }
          if(to) {
            paramsID += `&dt_date_lte=${to}`
          }
          return this.chartsService.getChartById(type, paramsID);
        }
        return this.chartsService.charts$;
      }),
      delay(750)
    );

  constructor(
    @Inject(ChartsService) private chartsService: ChartsService,
    private activatedRoute: ActivatedRoute
  ) {
  }
}
