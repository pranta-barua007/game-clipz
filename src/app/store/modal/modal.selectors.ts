import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ModalState } from './modal.reducer';

export const selectModalsState = createFeatureSelector<ModalState>('modal');

export const selectModals = createSelector(
  selectModalsState,
  (state) => state.modals
);

export const selectModalIsOpen = (id: string) => createSelector(
    selectModals,
    (modals) => modals.find((element) => element.id === id)?.visible || false
);