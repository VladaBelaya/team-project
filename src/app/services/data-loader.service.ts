import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Data0 {
  office_id: number;
  wh_id: number;
  qty: number;
}

export interface Data1 {
  office_id: number;
  wh_id: number;
  dt_date: string;
  qty: number;
}

@Injectable({
  providedIn: 'root',
})
export class DataLoaderService {
  constructor(private _http: HttpClient) {}

  private data_layer_0_URL = 'api/test_data_layer0.json';
  private data_layer_1_URL = 'api/test_data_layer1.json';

  getData0() {
    return this._http.get<Data0[]>(this.data_layer_0_URL);
  }

  getData1() {
    return this._http.get<Data1[]>(this.data_layer_1_URL);
  }
}
