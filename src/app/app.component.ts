import {Component, effect, signal, WritableSignal} from '@angular/core';
import { RouterModule } from '@angular/router';
import { KbqCommonModule } from '@koobiq/components/core';
import { ApiService } from './api.service';
import {NgForOf} from "@angular/common";
import {Agent, IArgs} from "./types";
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

      this.options = Object.keys(this.data[0])

      effect(() => {
        this.fetchData()
      });
  }

  data!: Agent[]
  options: string[]

  args: WritableSignal<IArgs> = signal({
    page: 0,
    pageSize:  10000,
    offset: 0,
    filters: {},
    sort: {field: 'id', order: 'asc'}
  })

  fetchData() {
    this.data = this.apiService.fetch(
        this.args().page,
        this.args().pageSize,
        this.args().offset,
        this.args().filters,
        this.args().sort
    )
  }

  changeOptions(newOptions: string[]) {
    this.options = newOptions
  }
}
