import { Injectable } from '@angular/core';
import { DataLoaderService } from "./data-loader.service";
import {map, Observable, shareReplay, tap} from "rxjs";

export enum ChartFilters {
  ORDER = 'qty_orders',
  NEW = 'qty_new',
  DELIVERED = 'qty_delivered',
  RETURN = 'qty_return',
}

interface Data1 {
  office_id: number;
  wh_id: number;
  dt_date?: string;
  qty: number;
}

interface DataArgumentId {
  [id: string]: Data1[];
}

export interface ChartDatasets {
  data: number[];
  label: string;
  borderColor?: string;
  backgroundColor?: string;
  tension?: number;
}

export interface ChartConfig {
  id: number | string;
  datasets: ChartDatasets[];
  labels: string[];
  name: string;
}


@Injectable({
  providedIn: 'root',
})
export class ChartsService {
  public initialData: Data1[] = [];
  public charts$: Observable<[ChartConfig]>;
  public lineChartLegend: boolean = true;
  public shareData$ = this._dataLoader.getData1()
    .pipe(
      tap((result: any) => {
        this.initialData.push(...result);
        console.log(result)
      }),
      shareReplay(1)
    );

  constructor(private readonly _dataLoader: DataLoaderService) {
    this.charts$ = this.shareData$.pipe(
      map(
        (response) =>
          [
            ...this.groupById(
              this.groupByKey(
                response,
                (response: Data1) => response.wh_id
              )
            ),

          ] as [ChartConfig]
      )
    );
  }


  public groupById(data: DataArgumentId): ChartConfig[] {
    return Object.keys(data).map((id) =>
      data[id].reduce(
        (accumulator, current) => {
          accumulator.id = current.wh_id;
          accumulator.name = String(current.wh_id);

          accumulator.datasets[0].data.push(current.qty);
          if (current.dt_date != null) {
            accumulator.labels.push(current.dt_date);
          }
          return { ...accumulator };
        },
        {
          id,
          datasets: [
            {
              data: [],
              label: 'Количество',
              tension: 0.5,
            }
          ],
          labels: [],
          name: '',
        } as ChartConfig
      )
    );
  }

  public groupByKey = <T, K extends keyof any>(
    list: T[],
    getKey: (item: T) => K
  ) =>
    list.reduce((previous, currentItem) => {
      const group = getKey(currentItem);
      if (!previous[group]) previous[group] = [];
      previous[group].push(currentItem);
      return previous;
    }, {} as Record<K, T[]>);
}
