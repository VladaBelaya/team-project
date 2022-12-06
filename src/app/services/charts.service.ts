import { Injectable } from '@angular/core';
import {ChartsModule} from "../charts/charts.module";
import {DataLoaderService} from "./data-loader.service";

@Injectable({
  providedIn: ChartsModule
})
export class ChartsService {

  constructor(private dataLoaderService: DataLoaderService) { }
}
