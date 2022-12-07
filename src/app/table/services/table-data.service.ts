import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
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

  constructor(private _dataLoader: DataLoaderService) {}

  getAllData(): Observable<Data1[]> {
    return this._dataLoader.getData1();
  }

  getOffices(): Observable<TableData[]> {
    return this.getAllData().pipe(
      map((data) =>
        Array.from(new Set(data.map((datum) => datum.office_id))).map(
          (id) =>
            <TableData>{
              office_id: id,
              dt_date: null,
              qty: null,
              wh_id: null,
            }
        )
      )
    );
  }

  getStorages(office_id: number) {
    return this.getAllData().pipe(
      map((data) =>
        Array.from(
          new Set(
            data
              .filter((data) => data.office_id === office_id)
              .map((datum) => datum.wh_id)
          )
        ).map(
          (id) =>
            <TableData>{
              office_id: office_id,
              dt_date: null,
              qty: null,
              wh_id: id,
            }
        )
      )
    );
  }

  getDatesAndQuantities(wh_id: number, range: Range) {
    return this.getAllData().pipe(
      map((data) =>
        data
          .filter((datum) => datum.wh_id === wh_id)
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
