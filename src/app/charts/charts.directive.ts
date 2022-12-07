import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';
import { Chart, registerables } from 'chart.js';

import {ChartConfig} from "../services/charts.service";

@Directive({
  selector: '[appChart]',
})
export class ChartsDirective implements AfterViewInit {
  @Input() public data!: ChartConfig;

  constructor(private readonly el: ElementRef<HTMLCanvasElement>) {
    Chart.register(...registerables);
  }
  ngAfterViewInit() {
    this.initChart();
  }

  private initChart() {
    new Chart(this.el.nativeElement, {
        type: 'line',
        data: this.data,

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
              text: this.data.name,
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
