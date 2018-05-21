import Store from '../store/event';

export const initialState = Store;

export default function eventSingleReducer(state = initialState, action) {
  switch (action.type) {
    case 'EVENT_ERROR': {
      return {
        ...state,
        error: action.data,
        loadingData: false,
      };
    }
    case 'NOTES_REPLACE': {
      return {
        ...state,
        notes: action.data,
        loadingData: false,
      };
    }
    case 'POSTS_REPLACE': {
      return {
        ...state,
        posts: action.data,
        loadingData: false,
      };
    }
    case 'POSTS_FETCHING': {
      return {
        ...state,
        loadingData: true,
      };
    }
    case 'POSTS_ERROR': {
      return {
        ...state,
        loadingData: false,
        error: action.data,
      };
    }
    case 'WP_USERS_FETCHING': {
      return {
        ...state,
        loading: true,
      };
    }
    case 'WP_USERS_ERROR': {
      return {
        ...state,
        error: action.data,
      };
    }
    case 'WP_USERS_REPLACE': {
      const wpUsers = action.data;
      return {
        ...state,
        error: null,
        loading: false,
        wpUsers,
      };
    }
    default:
      return state;
  }
}
