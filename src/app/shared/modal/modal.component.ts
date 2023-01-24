import {
  Component,
  Input,
  OnInit,
  ElementRef,
  OnDestroy
} from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { toggleModal } from '@store/modal/modal.actions';
import { selectModalIsOpen } from '@store/modal/modal.selectors';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  //providers: [ModalService]
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() modalId = '';

  constructor(
    public modal: ModalService, //converted to ngrx
    public store: Store,
    public el: ElementRef
  ) {
    console.log(el, this.modalId);
  }

  isOpen$(modalId: string): Observable<boolean> {
    return this.store.select(selectModalIsOpen(modalId));
  }

  ngOnInit(): void {
    document.body.appendChild(this.el.nativeElement);
  }

  ngOnDestroy() {
    document.body.removeChild(this.el.nativeElement);
  }

  closeModal() {
    //this.modal.toggleModal(this.modalId) //converted to ngrx
    this.store.dispatch(toggleModal({ id: this.modalId }));
  }
}
