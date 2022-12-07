import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, share, shareReplay } from 'rxjs';
import { DataLoaderService } from 'src/app/services/data-loader.service';
import { Data1 } from 'src/app/services/data-loader.service';
import { Range } from '../table.component';

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

  constructor(
    private _dataLoader: DataLoaderService,
    private _http: HttpClient
  ) {}

  getAllData(): Observable<Data1[]> {
    return this._dataLoader.getData1();
  }

  getOffices(): Observable<Data1[]> {
    return this._http.get<Data1[]>('offices').pipe(
      shareReplay(1),
      map((data) =>
        Array.from(
          data.reduce((output, current) => {
            if (!current.office_id) {
              return output;
            }
            if (!output.has(String(current.office_id))) {
              output.set(String(current.office_id), current);
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
      )
    );
  }

  getStorages(office_id: number) {
    return this._http
      .get<Data1[]>(`offices?office_id=${office_id}`)
      .pipe(shareReplay(1));
  }

  getDatesAndQuantities(wh_id: number, range: Range) {
    return this._http.get<Data1[]>(`warehouses?wh_id=${wh_id}`).pipe(
      shareReplay(1),
      map((data) =>
        data
          .filter((datum) => {
            const startDate = range.start;
            const endDate = range.end;
            const date = new Date(Date.parse(datum.dt_date!));
            if (startDate && startDate.getTime() > date.getTime()) {
              return false;
            }
            if (endDate && endDate.getTime() < date.getTime()) {
              return false;
            }
            return true;
          })
          .map((datum) => {
            const date = new Date(Date.parse(datum.dt_date!));
            const result = date.toLocaleDateString('en-GB', {
              // you can use undefined as first argument
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            });
            datum.dt_date = result;
            return datum;
          })
      )
    );
  }
}
