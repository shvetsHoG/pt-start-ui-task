import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Agent} from "../../types";
import {CdkVirtualScrollViewport, ScrollingModule} from "@angular/cdk/scrolling";
import {KbqIconModule} from "@koobiq/components/icon";
import {KbqComponentColors} from "@koobiq/components/core";
import {KbqButtonModule} from "@koobiq/components/button";

@Component({
  selector: 'pt-start-ui-task-table',
  standalone: true,
  imports: [CommonModule, CdkVirtualScrollViewport, ScrollingModule, KbqIconModule, KbqButtonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  @Input() data!: Agent[]
  colors = KbqComponentColors;
  keys!: string[]
  values = this.data
  keysLength!: number

  ngOnInit() {
    this.keys = Object.keys(this.data[0])
    this.keysLength = this.keys.length
  }
}
