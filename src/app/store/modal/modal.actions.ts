import { createAction, props } from '@ngrx/store';

export const registerModal = createAction(
  '[Modal] Register',
  props<{ id: string }>()
);

export const unregisterModal = createAction(
  '[Modal] Unregister',
  props<{ id: string }>()
);

export const toggleModal = createAction(
  '[Modal] Toggle',
  props<{ id: string }>()
);
