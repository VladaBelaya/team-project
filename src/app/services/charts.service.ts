import {Injectable, OnDestroy} from '@angular/core';
import {map, Observable, ReplaySubject, shareReplay, takeUntil, tap} from 'rxjs';
import {HttpClient} from "@angular/common/http";

export enum ChartFilters {
  ORDER = 'qty',
}
interface ChartsData {
  office_id: number;
  wh_id: number;
  dt_date: string;
  qty: number;
}

interface DataArgumentId {
  [id: string]: ChartsData[];
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

@Injectable()
export class ChartsService {
  private data_layer_1_URL = 'warehouses';
  public initialData: ChartsData[] = [];
  public charts$: Observable<[ChartConfig]>;
  public shareData$ = this._http.get<ChartsData[]>(this.data_layer_1_URL).pipe(
    tap((result) => {
      this.initialData.push(...result);
    }),
    shareReplay(1)
  );

  constructor(private readonly _http: HttpClient) {
    this.charts$ = this.shareData$.pipe(
      map((response) => {
          return [
            ...this.groupByWhId(
              this.groupByKey(response, (response: ChartsData) => response.wh_id)
            ),
          ] as [ChartConfig]
        }
      )
    );
  }

  public groupByWhId(data: DataArgumentId): ChartConfig[] {
    return Object.keys(data).map((id) =>
      data[id].reduce(
        (accumulator, current) => {
          accumulator.id = current.wh_id;
          accumulator.name = `ID склада: ${current.wh_id}`;

          accumulator.datasets[0].data.push(current.qty);
          if (current.dt_date != null) {
            accumulator.labels.push(current.dt_date);
          }
          return {...accumulator};
        },
        {
          id,
          datasets: [
            {
              data: [],
              label: 'Количество',
              tension: 0.5,
            },
          ],
          labels: [],
          name: '',
        } as ChartConfig
      )
    );
  }
  private setLabel(label: ChartFilters): string {
    switch (label) {
      case ChartFilters.ORDER:
        return 'Заказы';
      default:
        return '';
    }
  }

  createMainCharts(data: ChartsData): ChartConfig {
    const {office_id} = Object.values(data)[0][0]
    const filters: ChartFilters[] = Object.values(ChartFilters);
    const allDates: string[] = Object.keys(data);
    const daysWithSorted: Array<ChartsData[]> = Object.values(data);
    const mainChartsData = filters.map((key: ChartFilters) => ({
      label: this.setLabel(key),
      data: daysWithSorted.map((day: ChartsData[]) =>
        day.reduce(
          (accumulator: number, current: ChartsData) =>
            accumulator + current[key], 0)
      ),
    }));
    return {
      id: office_id,
      datasets: mainChartsData,
      labels: allDates,
      name: `График офиса ${office_id}`
    };
  }

  public getChartById(type: string, id: string): Observable<[ChartConfig]> {
    return this._http.get<ChartsData[]>(`warehouses?${id}`).pipe(
      map((response) => {
          const searchParams = type === 'offices';
          if (searchParams) {
            return [
              this.createMainCharts(this.groupByKey(response, (response: ChartsData) => response.dt_date) as unknown as ChartsData)
            ]
          } else {
            return [
              ...this.groupByWhId(
                this.groupByKey(response, (response: ChartsData) => response.wh_id)
              ),
            ] as [ChartConfig]
          }
        }
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
