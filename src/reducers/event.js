import Store from '../store/event';

export const initialState = Store;

export default function eventSingleReducer(state = initialState, action) {
  // console.log(action.type);
  // console.log(action);
  switch (action.type) {
    case 'EVENTS_SETTER': {
      const eventId = action.data;
      const { events } = state;
      const event = events.find(({ id }) => id === eventId);
      return {
        ...state,
        eventId,
        event,
      };
    }
    case 'EVENTS_REPLACE': {
      const events = action.data;
      return {
        ...state,
        events,
      };
    }
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
    case 'POSTS_ON': {
      return {
        ...state,
        listening: true,
      };
    }
    case 'POSTS_FETCHING': {
      return {
        ...state,
        loadingData: true,
      };
    }
    case 'POSTS_POSTED': {
      return {
        ...state,
        upload: {
          ...state.upload,
          uploading: false,
          metadata: {},
        },
      };
    }
    case 'POSTS_ERROR': {
      return {
        ...state,
        loadingData: false,
        error: action.data,
      };
    }
    case 'MEDIA_UPLOAD_END': {
      return {
        ...state,
        upload: {
          ...state.upload,
          uploading: false,
          metadata: action.data,
        },
      };
    }
    case 'MEDIA_UPLOAD_PROGRESS': {
      return {
        ...state,
        upload: {
          ...state.upload,
          uploading: true,
          progress: action.data,
        },
      };
    }
    case 'MEDIA_UPLOAD_ERROR': {
      return {
        ...state,
        upload: {
          ...state.upload,
          uploading: false,
          error: action.data,
        },
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
