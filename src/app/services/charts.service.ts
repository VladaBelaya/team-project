import { Injectable } from '@angular/core';
import { ChartsModule } from '../charts/charts.module';
import { DataLoaderService } from './data-loader.service';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChartsService {
  private request = this.dataLoaderService.getData1();
  public charts$: Observable<any>;
  constructor(private dataLoaderService: DataLoaderService) {
    this.charts$ = this.request.pipe(
      tap((result) => {
        console.log(result);
      })
    );
  }
}
