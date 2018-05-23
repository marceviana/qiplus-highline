import Store from '../store/events';

export const initialState = Store;

export default function eventReducer(state = initialState, action) {
  switch (action.type) {
    case 'EVENTS_ERROR': {
      return {
        ...state,
        error: action.data,
      };
    }
    case 'EVENTS_REPLACE': {
      const events = action.data;
      return {
        ...state,
        error: null,
        loading: false,
        loader: false,
        events,
      };
    }
    default:
      return state;
  }
}
