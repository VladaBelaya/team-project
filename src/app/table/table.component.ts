import { Component, OnInit } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { TableDataService, TableData } from './services/table-data.service';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';

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
  officeData!: TableData[];
  storageData!: TableData[];
  datesAndQuantitiesData!: TableData[];
  columnsToDisplay = this._tableData.COLUMNNAMES;
  columnNames = this.columnsToDisplay.map((column) => column.id);
  columnsToDisplayWithExpand = [
    ...this.columnsToDisplay.map((column) => column.id),
    'expand',
  ];
  expandedOffice!: TableData | null;
  expandedStorage!: TableData | null;

  dateRange = new FormGroup({
    range: new FormGroup({
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null),
    }),
  });

  get range() {
    return this.dateRange.get('range');
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

  updateDates() {}

  getStorages(office_id: number) {
    this._tableData.getStorages(office_id).subscribe((data) => {
      this.storageData = data;
    });
  }

  clearStorages() {
    this.storageData = [];
  }

  getDatesAndQuantities(wh_id: number) {
    this._tableData.getDatesAndQuantities(wh_id).subscribe((data) => {
      this.datesAndQuantitiesData = data;
    });
  }

  clearDatesAndQuantities() {
    this.datesAndQuantitiesData = [];
  }

  openChart(wh_id: number) {
    console.log(wh_id);
  }

  ngOnInit() {
    this._tableData.getOffices().subscribe((data) => {
      this.officeData = data;
    });
  }
}
