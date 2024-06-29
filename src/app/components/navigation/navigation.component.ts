import {
    Component,
    EventEmitter,
    Input,
    Output,
    ViewEncapsulation,
    WritableSignal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { KbqFormFieldModule } from '@koobiq/components/form-field';
import { KbqIconModule } from '@koobiq/components/icon';
import { FormsModule } from '@angular/forms';
import { KbqComponentColors, KbqOptionModule } from '@koobiq/components/core';
import { KbqButtonModule, KbqButtonStyles } from '@koobiq/components/button';
import { KbqInputModule } from '@koobiq/components/input';
import { KbqSelectModule } from '@koobiq/components/select';
import { KbqPopoverModule } from '@koobiq/components/popover';
import { KbqCheckboxModule } from '@koobiq/components/checkbox';
import { IArgs } from '../../types';
import { BehaviorSubject, debounce, debounceTime } from 'rxjs';
import { AgentModalComponent } from '../agent-modal/agent-modal.component';

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
        KbqCheckboxModule,
        AgentModalComponent
    ],
    templateUrl: './navigation.component.html',
    styleUrl: './navigation.component.scss',
    encapsulation: ViewEncapsulation.None
})
export class NavigationComponent {
    @Input() args!: WritableSignal<IArgs>;
    @Input() options!: string[];
    @Output() changedColumns = new EventEmitter<string[]>();

    ngOnInit() {
        for (let option of this.options) {
            this.constOptionsArray.push(option);
            this.constOptions[option] = true;
        }

        this.searchSubject.pipe(debounceTime(800)).subscribe(obj => {
            this.inputSearchByValues(obj['value'], obj['filterField']);
        });
    }

    ngOnChanges() {
        this.selectedOption = this.options[0];
    }

    colors = KbqComponentColors;
    styles = KbqButtonStyles;

    inputAllValue = '';
    inputColumnValue = '';
    selectedOption = '';

    searchSubject = new BehaviorSubject<Record<string, string>>({});

    constOptions: Record<string, boolean> = {};
    constOptionsArray: string[] = [];

    inputSearchByValues(value: string, filterField: string) {
        if (filterField === 'data') {
            this.args.set({
                ...this.args(),
                filters: { ...this.args().filters, data: value }
            });
        } else {
            this.args.set({
                ...this.args(),
                filters: { [filterField]: value, data: this.inputAllValue }
            });
        }
    }

    chooseColumns() {
        const newOption = [];
        for (let option in this.constOptions) {
            if (this.constOptions[option]) {
                newOption.push(option);
            }
        }

        this.changedColumns.emit(newOption);
    }

    handleSearchDebounce(value: string, field: string) {
        this.searchSubject.next({ value: value, filterField: field });
    }
}
