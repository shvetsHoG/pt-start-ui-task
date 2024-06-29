import { CommonModule } from '@angular/common';
import { KbqButtonModule, KbqButtonStyles } from '@koobiq/components/button';
import {
    KbqModalModule,
    KbqModalService,
    ModalSize
} from '@koobiq/components/modal';
import { Component, Input, TemplateRef, WritableSignal } from '@angular/core';
import { ApiService } from '../../api.service';
import { KbqFormFieldModule } from '@koobiq/components/form-field';
import { KbqComponentColors, KbqOptionModule } from '@koobiq/components/core';
import { KbqSelectModule } from '@koobiq/components/select';
import { IAddAgent, IArgs, OS } from '../../types';
import { FormsModule } from '@angular/forms';
import { KbqIconModule } from '@koobiq/components/icon';
import { KbqInputModule } from '@koobiq/components/input';
import {
    KbqToastModule,
    KbqToastService,
    KbqToastStyle
} from '@koobiq/components/toast';

@Component({
    selector: 'pt-start-ui-task-agent-modal',
    standalone: true,
    imports: [
        CommonModule,
        KbqButtonModule,
        KbqModalModule,
        KbqFormFieldModule,
        KbqOptionModule,
        KbqSelectModule,
        FormsModule,
        KbqIconModule,
        KbqInputModule,
        KbqToastModule
    ],
    templateUrl: './agent-modal.component.html',
    styleUrl: './agent-modal.component.scss'
})
export class AgentModalComponent {
    @Input() args!: WritableSignal<IArgs>;
    constructor(
        private modalService: KbqModalService,
        private apiService: ApiService,
        private toastService: KbqToastService
    ) {}

    colors = KbqComponentColors;
    styles = KbqButtonStyles;

    os: OS[] = [OS.Windows, OS.Linux, OS.Macos];
    groups: string[] = [
        'servers',
        'workstations',
        'mail_servers',
        'dns_servers'
    ];
    tags: string[] = ['important', 'old', 'need_upgrade', 'need_move'];

    selectedValues: IAddAgent = {
        name: '',
        os: OS.Windows,
        tags: [this.tags[0]],
        group: this.groups[0]
    };

    isShowAlertSpan: boolean = false;

    createModal(
        Title: TemplateRef<{}>,
        Content: TemplateRef<{}>,
        Footer: TemplateRef<{}>
    ) {
        this.modalService.create({
            kbqSize: ModalSize.Medium,
            kbqTitle: Title,
            kbqContent: Content,
            kbqFooter: Footer,
            kbqOnCancel: () => this.clearSelectedValues()
        });
    }

    createNewAgent() {
        const newAgentPart: IAddAgent = this.selectedValues;

        if (this.selectedValues.name === '') {
            this.clearSelectedValues();
            this.isShowAlertSpan = true;
            return;
        }

        try {
            this.apiService.addAgent(newAgentPart);
            this.args.set({
                ...this.args(),
                sort: { field: 'id', order: 'desc' }
            });
            this.showToast('success');
        } catch (e) {
            this.showToast('error');
        }

        this.clearSelectedValues();
        this.modalService.closeAll();
    }

    cancelModal() {
        this.modalService.closeAll();

        this.clearSelectedValues();
    }

    clearSelectedValues() {
        this.selectedValues.name = '';
        this.selectedValues.os = OS.Windows;
        this.selectedValues.group = this.groups[0];
        this.selectedValues.tags = [this.tags[0]];
        this.isShowAlertSpan = false;
    }

    showToast(type: string) {
        if (type === 'success') {
            this.toastService.show({
                style: KbqToastStyle.Success,
                title: 'Новый агент добавлен',
                closeButton: true
            });
        }

        if (type === 'error') {
            this.toastService.show({
                style: KbqToastStyle.Error,
                title: 'Ошибка!',
                closeButton: true
            });
        }
    }
}
