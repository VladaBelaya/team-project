import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { delay, Observable } from 'rxjs';
import { Data1, TableDataService } from './services/table-data.service';

export interface Range {
  start: Date | null;
  end: Date | null;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
  providers: [TableDataService]
})
export class TableComponent implements OnInit {
  officeData$!: Observable<Data1[]>;
  storageData$!: Observable<Data1[]>;
  datesAndQuantitiesData$!: Observable<Data1[]>;
  currentWhId!: number;
  columnsToDisplay = this._tableData.COLUMN_NAMES;
  columnNames = this.columnsToDisplay.map((column) => column.id);
  columnsToDisplayWithExpand = [
    ...this.columnsToDisplay.map((column) => column.id),
    'expand',
  ];
  expandedOffice!: Data1 | null;
  expandedStorage!: Data1 | null;

  dateRangeControl = new FormGroup({
    range: new FormGroup({
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null),
    }),
  });

  dateRange: Range = this.range!.value;
  from: string = ''
  to: string = ''

  get range(){
    return this.dateRangeControl.get('range');
  }

  minDate: Date;
  maxDate: Date;

  constructor(
    private _tableData: TableDataService,
    private readonly _router: Router
  ) {
    const currentDate = new Date();
    this.minDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 6,
      currentDate.getDay()
    );
    this.maxDate = new Date(currentDate);
  }

  updateDates() {
    this.dateRange = this.range!.value;
    if (this.currentWhId) {
      this.getDatesAndQuantities(this.currentWhId);
    }
    this.from = this.dateRange.start
      ? `${this.dateRange.start.getFullYear()}-${
        this.dateRange.start.getMonth() + 1 < 10
          ? '0' + (this.dateRange.start.getMonth() + 1)
          : this.dateRange.start.getMonth() + 1
      }-${
        this.dateRange.start.getDate() < 10
          ? '0' + this.dateRange.start.getDate()
          : this.dateRange.start.getDate()
      }`
      : '';
    this.to = this.dateRange.end
      ? `${this.dateRange.end.getFullYear()}-${
        this.dateRange.end.getMonth() + 1 < 10
          ? '0' + (this.dateRange.end.getMonth() + 1)
          : this.dateRange.end.getMonth() + 1
      }-${
        this.dateRange.end.getDate() < 10
          ? '0' + this.dateRange.end.getDate()
          : this.dateRange.end.getDate()
      }`
      : '';
  }

  onExpandOffice(element: Data1, $event: MouseEvent) {
    if (this.expandedOffice === element) {
      this.expandedOffice = null;
    } else {
      this.expandedOffice = element;
      this.getStorages(element.office_id!);
    }
    $event.stopPropagation();
  }

  getStorages(office_id: number) {
    this.storageData$ = this._tableData.getStorages(office_id);
  }

  onExpandStorage(element: Data1, $event: MouseEvent) {
    if (this.expandedStorage === element) {
      this.expandedStorage = null;
    } else {
      this.expandedStorage = element;
      this.getDatesAndQuantities(element.wh_id!);
    }
    $event.stopPropagation();
  }

  getDatesAndQuantities(wh_id: number) {
    this.currentWhId = wh_id;
    this.datesAndQuantitiesData$ = this._tableData
      .getDatesAndQuantities(wh_id, this.dateRange)
      .pipe(delay(350));
  }

  public getType(type: string): string {
    switch (type) {
      case 'Офис':
        return 'offices';
      case 'Склад':
        return 'warehouses';
      default:
        return '';
    }
  }

  openChart(type: string, id: string, from: string, to: string) {
    type = this.getType(type);
    this._router.navigate(['/charts'], {
      queryParams: {
        type,
        id,
        from,
        to
      },
    });
  }

  ngOnInit() {
    this.officeData$ = this._tableData.getOffices();
  }
}
