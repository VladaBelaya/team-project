import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import {Data} from "./charts.component";

@Directive({
  selector: '[appChart]',
})
export class ChartsDirective implements AfterViewInit {
  @Input() public data!: Data;

  constructor(private readonly el: ElementRef<HTMLCanvasElement>) {
    Chart.register(...registerables);
  }
  ngAfterViewInit() {
    this.initChart();
  }

  private initChart() {
      new Chart(this.el.nativeElement, {
        type: 'line',
        data: {
          labels: [1, 2, 3, 4, 5, 6, 7],
          datasets: [
            {
              label: 'wh_id',
              data: [65, 59, 80, 81, 56, 55, 40],
              borderColor: 'rgb(75, 192, 192)',
              fill: false
            }
          ]
        },

        options: {
          elements: {
            point: {
              pointStyle: 'line',
            },
            line: {
              tension: 0.35,
            },
          },
          plugins: {
            title: {
              display: true,
              text: 'График',
              color: '#1E212C',
              font: {
                size: 30,
              },
              padding: {
                top: 30,
                bottom: 20,
              },
            },
          },
        },
      });
    }
}
