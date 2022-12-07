import { Component, OnInit } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { TableDataService, TableData } from './services/table-data.service';

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

  constructor(private _tableData: TableDataService) {}

  getStorages(office_id: number) {
    this._tableData.getStorages(office_id).subscribe((data) => {
      this.storageData = data;
      console.log(this.storageData);
    });
  }

  clearStorages() {
    this.storageData = [];
  }

  getDatesAndQuantities(wh_id: number) {
    this._tableData.getDatesAndQuantities(wh_id).subscribe((data) => {
      this.datesAndQuantitiesData = data;
      console.log(this.datesAndQuantitiesData);
    });
  }

  clearDatesAndQuantities() {
    this.datesAndQuantitiesData = [];
  }

  ngOnInit() {
    this._tableData.getOffices().subscribe((data) => {
      this.officeData = data;
      console.log(this.officeData);
    });
  }
}
