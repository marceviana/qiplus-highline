import status from './status';
import member from './member';
import recipes from './recipes';
import events from './events';
import event from './event';
import locale from './locale';
import {Reducer as routerReducer} from 'react-native-router-flux'

const rehydrated = (state = false, action) => {
  switch (action.type) {
    case 'persist/REHYDRATE':
      return true;
    default:
      return state;
  }
};

export default {
  routerReducer,
  rehydrated,
  status,
  member,
  recipes,
  events,
  event,
  locale,
};
