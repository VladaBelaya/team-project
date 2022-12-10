import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map, Observable, shareReplay} from 'rxjs';
import {Range} from '../table.component';

export interface Data0 {
  office_id: number;
  wh_id: number;
  qty: number;
}

export interface Data1 {
  office_id: number | null;
  wh_id: number | null;
  dt_date: string | null;
  qty: number | null;
}

export interface TableData extends Data1 {}
export interface Columns {
  name: string;
  id: string;
}

@Injectable({
  providedIn: 'root',
})
export class TableDataService {
  public COLUMNNAMES: Columns[] = [
    {
      name: 'Офис',
      id: 'office_id',
    },
    {
      name: 'Склад',
      id: 'wh_id',
    },
    {
      name: 'Дата',
      id: 'dt_date',
    },
    {
      name: 'Количество',
      id: 'qty',
    },
  ];

  constructor(private _http: HttpClient) {}

  getOffices(): Observable<Data1[]> {
    return this._http.get<Data1[]>('offices').pipe(
      map((data) =>
        Array.from(
          data.reduce((output, current) => {
            if (!current.office_id) {
              return output;
            }
            if (!output.has(String(current.office_id))) {
              output.set(String(current.office_id), <Data1>{
                wh_id: null,
                qty: current.qty!,
                dt_date: current.dt_date,
                office_id: current.office_id,
              });
              return output;
            }
            const prevValue = output.get(String(current.office_id))!;
            output.set(String(current.office_id), <Data1>{
              wh_id: null,
              qty: current.qty! + prevValue.qty!,
              dt_date: current.dt_date,
              office_id: current.office_id,
            });
            return output;
          }, new Map<string, Data1>())
        ).map((data) => data[1])
      ),
      shareReplay(1)
    );
  }

  getStorages(office_id: number): Observable<Data1[]> {
    return this._http
      .get<Data1[]>(`offices?office_id=${office_id}`)
      .pipe(shareReplay(1));
  }

  getDatesAndQuantities(wh_id: number, range: Range): Observable<Data1[]> {
    const from = range.start
      ? `&dt_date_gte=${range.start.getFullYear()}-${
          range.start.getMonth() + 1 < 10
            ? '0' + (range.start.getMonth() + 1)
            : range.start.getMonth() + 1
        }-${
          range.start.getDate() < 10
            ? '0' + range.start.getDate()
            : range.start.getDate()
        }`
      : '';
    const to = range.end
      ? `&dt_date_lte=${range.end.getFullYear()}-${
          range.end.getMonth() + 1 < 10
            ? '0' + (range.end.getMonth() + 1)
            : range.end.getMonth() + 1
        }-${
          range.end.getDate() < 10
            ? '0' + range.end.getDate()
            : range.end.getDate()
        }`
      : '';
    return this._http
      .get<Data1[]>(`warehouses?wh_id=${wh_id}${from}${to}`)
      .pipe(
        map((data) =>
          data.map((datum) => {
            const date = new Date(Date.parse(datum.dt_date!));
            datum.dt_date = date.toLocaleDateString('en-GB', {
              // you can use undefined as first argument
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            });
            datum.office_id = null;
            return datum;
          })
        ),
        shareReplay(1)
      );
  }
}
