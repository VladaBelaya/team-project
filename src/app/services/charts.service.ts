import {Injectable, OnDestroy} from '@angular/core';
import {map, Observable, ReplaySubject, shareReplay, takeUntil, tap} from 'rxjs';
import {HttpClient} from "@angular/common/http";

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

@Injectable()
export class ChartsService implements OnDestroy {
  private destroy$ = new ReplaySubject(1)

  private data_layer_1_URL = 'warehouses';
  public initialData: Data1[] = [];
  public charts$: Observable<[ChartConfig]>;
  public shareData$ = this._http.get<Data1[]>(this.data_layer_1_URL).pipe(
    tap((result: any) => {
      this.initialData.push(...result);
    }),
    shareReplay(1),
    takeUntil(this.destroy$)
  );

  constructor(private readonly _http: HttpClient) {
    this.charts$ = this.shareData$.pipe(
      map((response) => {
          return [
            ...this.groupByWhId(
              this.groupByKey(response, (response: Data1) => response.wh_id)
            ),
          ] as [ChartConfig]
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next(1)
    this.destroy$.complete()
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

  public groupByOfficeId(data: DataArgumentId): ChartConfig[] {
    return Object.keys(data).map((id) =>
      data[id].reduce(
        (accumulator, current) => {
          accumulator.id = current.office_id;
          accumulator.name = `ID офиса: ${current.office_id}`;

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

  public getChartById(type: string, id: string): Observable<[ChartConfig]> {
    return this._http.get<Data1[]>(`warehouses?${id}`).pipe(
      map((response) => {
          const searchParams = type === 'offices';
          if (searchParams) {
            return [
              ...this.groupByOfficeId(
                this.groupByKey(response, (response: Data1) => response.office_id)
              ),
            ] as [ChartConfig]
          } else {
            return [
              ...this.groupByWhId(
                this.groupByKey(response, (response: Data1) => response.wh_id)
              ),
            ] as [ChartConfig]
          }

        }
      ),
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
