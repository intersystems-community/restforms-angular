import {Component, HostListener, Input, OnInit} from '@angular/core';
import {IModal, IModalButton, ModalService} from '../../../services/modal.service';

@Component({
    selector: 'rf-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
    @Input() data: IModal;

    constructor(private ms: ModalService) {
    }

    @HostListener('document:keydown', ['$event'])
    onGlobalKeyPressed(e: KeyboardEvent) {
        // Use hotkeys only for topmost modal
        if (!this.isTopmost()) {
            return;
        }
        switch (e.code.toLowerCase()) {
            case 'enter':
                this.processEnterKey();
                break;
            case 'escape':
                this.processEscapeKey();
                break;
        }
    }

    /**
     * Closes modal
     */
    close() {
        this.ms.close(this.data);
    }

    /**
     * On modal button click
     */
    onButtonClick(btn: IModalButton) {
        if (btn.click) {
            btn.click(this, this.data, btn);
        }
        if (btn.autoClose) {
            this.close();
        }
    }

    /**
     * Processing pressing of enter key
     */
    private processEnterKey() {
        if (!this.data.buttons?.length) {
            return;
        }
        const btn = this.data.buttons.find(b => b.default);
        if (!btn) {
            return;
        }
        if (btn.click) {
            btn.click(this, this.data, btn);
        }
        if (btn.autoClose) {
            this.close();
        }
    }

    private processEscapeKey() {
        if (this.data.closeByEsc) {
            this.close();
        }
    }

    /**
     * Checks if modal is topmost
     */
    private isTopmost(): boolean {
        const modals = this.ms.modals.getValue();
        return modals[modals.length - 1] === this.data;
    }
}
