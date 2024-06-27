import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { KbqCommonModule } from '@koobiq/components/core';
import { ApiService } from './api.service';
import {NgForOf} from "@angular/common";
import {Agent} from "./types";
import {NavigationComponent} from "./components/navigation/navigation.component";
import {TableComponent} from "./components/table/table.component";

@Component({
  standalone: true,
  imports: [RouterModule, KbqCommonModule, NgForOf, NavigationComponent, TableComponent],
  selector: 'pt-start-ui-task-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private apiService: ApiService) {
      this.fetchData()
  }

  data!: Agent[]
  page = 0
  pageSize = 10000
  offset = 0
  filters: Record<string, string[] | string | boolean | number> = {}
  sort: { field: string, order: 'asc' | 'desc'} = {field: 'name', order: 'asc'}

  fetchData() {
    this.data = this.apiService.fetch(this.page, this.pageSize, this.offset, this.filters, this.sort)
    console.log(this.data)
  }
}
