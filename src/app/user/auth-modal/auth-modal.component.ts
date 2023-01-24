import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

import { Store } from '@ngrx/store';
import { registerModal, unregisterModal } from '@store/modal/modal.actions';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.css']
})
export class AuthModalComponent implements OnInit, OnDestroy {
  constructor(
    public modal: ModalService, //converted to ngrx
    public store: Store) {}

  ngOnInit(): void {
    //this.modal.register('auth'); //converted to NgRx
    this.store.dispatch(registerModal({ id: 'auth' }));
  }

  ngOnDestroy(): void {
    //this.modal.unregister('auth'); //converted to NgRx
    this.store.dispatch(unregisterModal({ id: 'auth' }));
  }
}
