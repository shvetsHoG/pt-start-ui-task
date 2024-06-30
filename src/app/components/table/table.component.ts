import {
    Component,
    EventEmitter,
    Input,
    Output,
    WritableSignal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Agent, IOptions } from '../../types';
import {
    CdkVirtualScrollViewport,
    ScrollingModule
} from '@angular/cdk/scrolling';
import { KbqIconModule } from '@koobiq/components/icon';
import { KbqComponentColors } from '@koobiq/components/core';
import { KbqButtonModule } from '@koobiq/components/button';
import { ngxCsv } from 'ngx-csv';
import { KbqModalService } from '@koobiq/components/modal';

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
    styleUrl: './table.component.scss'
})
export class TableComponent {
    @Input() data!: Agent[];
    @Input() args!: WritableSignal<IOptions>;
    @Input() keys!: string[];
    @Output() agentId = new EventEmitter<number>();

    constructor(private modalService: KbqModalService) {}

    ngOnInit() {
        this.columnSortOrder = this.args().sort.order;
    }

    colors = KbqComponentColors;
    columnSortOrder!: 'asc' | 'desc';

    exportCSV() {
        const options = {
            title: 'Agent data',
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalSeparator: '.',
            showLabels: false,
            noDownload: false,
            showTitle: false,
            useBom: false
        };

        new ngxCsv(this.data, 'data', options);
    }

    updateColumnSort(field: string) {
        if (
            this.columnSortOrder === 'asc' &&
            this.args().sort.field === field
        ) {
            this.columnSortOrder = 'desc';
        } else {
            this.columnSortOrder = 'asc';
        }

        this.args.set({
            ...this.args(),
            sort: { field: field, order: this.columnSortOrder }
        });
    }

    deleteAgent(id: number) {
        this.agentId.emit(id);
    }

    showDeleteModal(id: number) {
        this.modalService.delete({
            kbqContent: 'Пользователь будет удален, продолжить?',
            kbqOkText: 'Удалить',
            kbqCancelText: 'Отмена',
            kbqWidth: '480px',
            kbqMaskClosable: true,
            kbqOnOk: () => this.deleteAgent(id),
            kbqOnCancel: () => this.modalService.closeAll()
        });
    }
}
