import { Component } from '@angular/core';

export interface Data {
  labels: number[],
  datasets: Datasets[]
}

interface Datasets {
  label: string,
  data: number[],
  fill?: boolean,
  borderColor?: string,
  tension?: number
}
@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})

export class ChartsComponent {
  public data: Data[] = [
    {
      labels: [1, 2, 3, 4, 5, 6, 7],
      datasets: [{
        label: 'My First Dataset',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.5
      }]
    },
    {
      labels: [1, 2, 3, 4, 5, 6, 7],
      datasets: [{
        label: 'My First Dataset',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.5
      }]
    }
  ]
}
