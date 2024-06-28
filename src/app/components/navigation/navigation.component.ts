import {Component, Input, ViewEncapsulation, WritableSignal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {KbqFormFieldModule} from "@koobiq/components/form-field";
import {KbqIconModule} from "@koobiq/components/icon";
import {FormsModule} from "@angular/forms";
import {KbqComponentColors, KbqOptionModule} from '@koobiq/components/core';
import {KbqButtonModule, KbqButtonStyles} from "@koobiq/components/button";
import { KbqInputModule } from '@koobiq/components/input';
import {KbqSelectModule} from "@koobiq/components/select";
import {KbqPopoverModule} from "@koobiq/components/popover";
import {KbqCheckboxModule} from "@koobiq/components/checkbox";
import {IArgs} from "../../types";

@Component({
  selector: 'pt-start-ui-task-navigation',
  standalone: true,
  imports: [
    CommonModule,
    KbqFormFieldModule,
    KbqIconModule,
    FormsModule,
    KbqButtonModule,
    KbqInputModule,
    KbqOptionModule,
    KbqSelectModule,
    KbqPopoverModule,
    KbqCheckboxModule
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class NavigationComponent {
  @Input() args!: WritableSignal<IArgs>
  colors = KbqComponentColors;
  value = '';
  styles = KbqButtonStyles;

  selected = 'id';

  options: string[] = ['id', 'name', 'os', 'authorization_status', 'connected', 'created_datetime', 'last_connected_datetime', 'group'];
  go() {
    this.args.set({...this.args(), sort: {field: 'id', order: 'desc'}
    })
  }
}
