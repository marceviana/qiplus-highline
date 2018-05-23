import { Firebase, FirebaseRef } from '../lib/firebase';

/**
  * Reset Events
  */
export function resetEvents(dispatch) {
  return dispatch({
    type: 'EVENTS_REPLACE',
    data: [],
  });
}


/**
  * Set an Error Message
  */
export function setEventsError(message) {
  return dispatch => new Promise(resolve => resolve(dispatch({
    type: 'EVENTS_ERROR',
    data: message,
  })));
}

/**
  * Set an Error Message
  */
export function eventSetter(id) {
  return {
    type: 'EVENTS_SETTER',
    data: id,
  };
}

/**
  * Get Events
  */
export function getEvents() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => FirebaseRef.child('events')
    .on('value', (snapshot) => {
      const results = snapshot.val() || [];
      let events = [];

      // Pick out the props I need
      if (results && typeof results === 'object') {
        if (!Array.isArray(results) && Object.keys(results).length) {
          events = Object.keys(results).map(id => ({
            id: results[id].dbid,
            ...results[id],
          }));
        } else {
          events = results.map(item => ({
            id: item.dbid,
            ...item,
          }));
        }
      }

      return resolve(dispatch({
        type: 'EVENTS_REPLACE',
        data: events,
      }));
    })).catch(e => console.log(e));
}
