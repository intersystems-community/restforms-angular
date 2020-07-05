import {Component, HostListener, OnInit} from '@angular/core';
import {ModalService} from '../../../services/modal.service';

@Component({
    selector: 'rf-object-selector',
    templateUrl: './object-selector.component.html',
    styleUrls: ['./object-selector.component.scss']
})
export class ObjectSelectorComponent implements OnInit {

    constructor(private ms: ModalService) {
    }

    ngOnInit(): void {
    }

    @HostListener('click')
    onClick() {
      this.ms.show({title: 'Delete', message: 'Do you really want to delete item? Do you really want to delete item?Do you really want to delete item?Do you really want to delete item?Do you really want to delete item?Do you really want to delete item?Do you really want to delete item?Do you really want to delete item?Do you really want to delete item?Do you really want to delete item?Do you really want to delete item?Do you really want to delete item?Do you really want to delete item?Do you really want to delete item?Do you really want to delete item?', closeByEsc: true});
      this.ms.show({title: 'Delete2', message: 'Do you really want to delete item?', closeByEsc: true});
    }

}
