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
    case 'EVENTS_LOADER': {
      return {
        ...state,
        loader: true,
      };
    }
    case 'EVENTS_SETTER': {
      const event = state.events.find(({ id }) => id === action.data) || {};
      return {
        ...state,
        eventId: action.data,
        event,
      };
    }
    case 'EVENTS_REPLACE': {
      const events = action.data;
      const event = events.find(({ id }) => id === state.eventId) || {};
      return {
        ...state,
        error: null,
        loading: false,
        loader: false,
        events,
        event,
      };
    }
    default:
      return state;
  }
}
