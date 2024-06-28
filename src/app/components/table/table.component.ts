import {Component, Input, WritableSignal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Agent, IArgs} from "../../types";
import {CdkVirtualScrollViewport, ScrollingModule} from "@angular/cdk/scrolling";
import {KbqIconModule} from "@koobiq/components/icon";
import {KbqComponentColors} from "@koobiq/components/core";
import {KbqButtonModule} from "@koobiq/components/button";
import {ngxCsv} from "ngx-csv";

@Component({
  selector: 'pt-start-ui-task-table',
  standalone: true,
  imports: [
    CommonModule,
    CdkVirtualScrollViewport,
    ScrollingModule,
    KbqIconModule,
    KbqButtonModule
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  @Input() data!: Agent[]
  @Input() args!: WritableSignal<IArgs>
  @Input() keys!: string[]

  colors = KbqComponentColors;

  keysLength!: number
  columnSortOrder: 'asc' | 'desc' = 'asc'

  ngOnInit() {
    this.keysLength = this.keys.length
  }

  exportCSV() {
    const options = {
      title: 'Agent data',
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: false,
      noDownload: false,
      showTitle: false,
      useBom: false,
      headers: this.keys
    }

    new ngxCsv(this.data, 'data', options)
  }

  updateColumnSort(field: string) {
    if (this.columnSortOrder === 'asc' && this.args().sort.field === field) {
      this.columnSortOrder = 'desc'
    } else {
      this.columnSortOrder = 'asc'
    }

    this.args.set({...this.args(), sort: {field: field, order: this.columnSortOrder}
    })
  }
}
