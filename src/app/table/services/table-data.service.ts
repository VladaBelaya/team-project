import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { DataLoaderService } from 'src/app/services/data-loader.service';
import { Data1 } from 'src/app/services/data-loader.service';

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

  getDatesAndQuantities(wh_id: number) {
    return this.getAllData().pipe(
      map((data) => data.filter((data) => data.wh_id === wh_id))
    );
  }
}
