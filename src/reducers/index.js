import status from './status';
import member from './member';
import recipes from './recipes';
import events from './events';
import event from './event';
import locale from './locale';

const rehydrated = (state = false, action) => {
  switch (action.type) {
    case 'persist/REHYDRATE':
      return true;
    default:
      return state;
  }
};

export default {
  rehydrated,
  status,
  member,
  recipes,
  events,
  event,
  locale,
};
