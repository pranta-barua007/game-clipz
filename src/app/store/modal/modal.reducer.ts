import { createReducer, on } from '@ngrx/store';
import { registerModal, unregisterModal, toggleModal } from './modal.actions';

export interface IModal {
  id: string;
  visible: boolean;
}

export interface ModalState {
  modals: IModal[];
}

export const initialState: ModalState = {
  modals: [],
};

export const modalReducer = createReducer(
  initialState,
  on(registerModal, (state, { id }) => {
    return {
      ...state,
      modals: [...state.modals, { id, visible: false }],
    };
  }),
  on(unregisterModal, (state, { id }) => {
    return {
      ...state,
      modals: state.modals.filter((element) => element.id !== id),
    };
  }),
  on(toggleModal, (state, { id }) => {
    const target = state.modals.find((element) => element.id === id);
    let updatedModal: IModal;
    if(target) {
      updatedModal = { ...target , visible: !target.visible };
    }
    return {
      ...state,
      modals: state.modals.map(modal => modal.id === id ? updatedModal : modal)
    };
  })
);
