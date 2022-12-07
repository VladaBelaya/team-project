import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { TableDataService, TableData } from './services/table-data.service';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Observable, tap } from 'rxjs';

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
})
export class TableComponent implements OnInit {
  officeData$!: Observable<TableData[]>;
  storageData$!: Observable<TableData[]>;
  datesAndQuantitiesData$!: Observable<TableData[]>;
  currentWhId!: number;
  columnsToDisplay = this._tableData.COLUMNNAMES;
  columnNames = this.columnsToDisplay.map((column) => column.id);
  columnsToDisplayWithExpand = [
    ...this.columnsToDisplay.map((column) => column.id),
    'expand',
  ];
  expandedOffice!: TableData | null;
  expandedStorage!: TableData | null;

  dateRangeControl = new FormGroup({
    range: new FormGroup({
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null),
    }),
  });

  dateRange: Range = this.range!.value;

  get range() {
    return this.dateRangeControl.get('range');
  }

  minDate: Date;
  maxDate: Date;

  constructor(private _tableData: TableDataService) {
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
  }

  getStorages(office_id: number) {
    this.storageData$ = this._tableData.getStorages(office_id).pipe(tap());
  }

  getDatesAndQuantities(wh_id: number) {
    this.currentWhId = wh_id;
    this.datesAndQuantitiesData$ = this._tableData.getDatesAndQuantities(
      wh_id,
      this.dateRange
    );
  }

  openChart(wh_id: number) {
    console.log(wh_id);
  }

  ngOnInit() {
    this.officeData$ = this._tableData.getOffices();
  }
}
