import { Firebase, FirebaseRef, ImagesRef } from '../lib/firebase';

/**
  * Set an Error Message
  */
export function showLoader() {
  return {
    type: 'EVENT_LOADER',
    data: '',
  };
}

export function listenToPosts(eventId) {
  if (!eventId || Firebase === null) return () => new Promise(resolve => resolve());

  const ref = FirebaseRef.child(`events/${eventId}/posts`);

  return dispatch => new Promise(resolve =>
    ref.on('value', (snapshot) => {
      const posts = snapshot.val() || {};

      // console.log('posts', posts);

      return resolve(dispatch({
        type: 'POSTS_REPLACE',
        data: posts,
      }));
    })).catch(e => console.log(e));
}

export function listenToNotes(eventId) {
  if (!eventId || Firebase === null) return () => new Promise(resolve => resolve());

  const ref = FirebaseRef.child(`events/${eventId}/notes`);

  return dispatch => new Promise(resolve =>
    ref.on('value', (snapshot) => {
      const notes = snapshot.val() || {};

      // console.log('notes', notes);

      return resolve(dispatch({
        type: 'NOTES_REPLACE',
        data: notes,
      }));
    })).catch(e => console.log(e));
}

export function getPosts(addedData) {
  // user, eventId, postId, postType,
  const {
    eventId, postType,
  } = addedData;

  if (!eventId || Firebase === null) return () => new Promise(resolve => resolve());

  const childType = postType === 'notes' ? postType : 'posts';
  const ref = FirebaseRef.child(`events/${eventId}/${childType}`);
  const ACTION_TYPE = postType === 'notes' ? 'NOTES_REPLACE' : 'POSTS_REPLACE';

  return dispatch => new Promise((resolve, reject) =>
    ref.once('value')
      .then((snapshot) => {
        const posts = snapshot.val() || {};

        return resolve(dispatch({
          type: ACTION_TYPE,
          data: posts,
        }));
      }).catch(reject)).catch(e => console.log(e));
}

export function setLoading() {
  return dispatch => new Promise(resolve => resolve(dispatch({
    type: 'POSTS_FETCHING',
  })));
}

export function addComment(commentData) {
  const {
    user, content, eventId, postId, postType,
  } = commentData;

  // console.log('commentData', commentData);

  if (!user || !eventId || !postId || Firebase === null) {
    return () => new Promise(resolve => resolve());
  }

  setLoading();

  const childType = postType === 'notes' ? postType : 'posts';
  const postRef = FirebaseRef.child(`events/${eventId}/${childType}/${postId}`);

  const pushToKey = (snapshot) => {
    const post = snapshot.val();
    const comments = post.comments || [];

    comments.push({ user, content });
    post.comments = comments;

    postRef.set(post);
    postRef.off('value', pushToKey);
  };

  postRef.once('value', pushToKey);

  return () => new Promise(resolve => resolve());
}

export function addPost(postData) {
  const {
    content, eventId, postType,
  } = postData;

  if (!content || !eventId || Firebase === null) return () => new Promise(resolve => resolve());


  const childType = postType === 'notes' ? postType : 'posts';
  const postsRef = FirebaseRef.child(`events/${eventId}/${childType}`);
  const lastRef = postsRef.orderByKey().limitToLast(1);

  const addToNextKey = (snapshot) => {
    const newPostId = snapshot.key && Number(snapshot.key) + 1;
    postsRef.child(newPostId).set({ ...postData, content, id: newPostId });
    lastRef.off('child_added', addToNextKey);
  };

  lastRef.once('child_added', addToNextKey);

  return () => new Promise(resolve => resolve());
}

export function toggleLike(likeData) {
  const {
    user, eventId, postId, postType,
  } = likeData;

  // console.log('likeData', likeData);

  if (!user || !eventId || !postId || Firebase === null) {
    return () => new Promise(resolve => resolve());
  }

  const childType = postType === 'notes' ? postType : 'posts';
  const postRef = FirebaseRef.child(`events/${eventId}/${childType}/${postId}`);

  const pushToKey = (snapshot) => {
    const post = snapshot.val();
    const uId = Number(user);
    let likes = post.likes || [];

    likes = likes.map(u => Number(u));

    if (likes.indexOf(uId) >= 0) {
      likes.splice(likes.indexOf(uId), 1);
    } else {
      likes.push(uId);
    }

    post.likes = likes;

    postRef.set(post);
    postRef.off('value', pushToKey);
  };

  postRef.once('value', pushToKey);

  return () => new Promise(resolve => resolve());
}


/**
  * Reset Participants
  */
export function resetParticipants(dispatch) {
  return dispatch({
    type: 'WP_USERS_REPLACE',
    data: [],
  });
}


/**
  * Set an Error Message
  */
export function setParticipantsError(message) {
  return dispatch => new Promise(resolve => resolve(dispatch({
    type: 'WP_USERS_ERROR',
    data: message,
  })));
}

/**
  * Get Participants
  */
export function getParticipants(participantIds) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise(resolve => FirebaseRef.child('wp_users')
    .orderByKey()
    .on('value', (snapshot) => {
      const results = snapshot.val() || [];
      const wpUsers = {};

      participantIds.forEach((id) => {
        if (results[id]) {
          wpUsers[id] = results[id];
        }
      });

      return resolve(dispatch({
        type: 'WP_USERS_REPLACE',
        data: wpUsers,
      }));
    })).catch(e => console.log(e));
}

export function uploadFile(data, callback) {
  const {
    eventId, path, file, user,
  } = data;

  const metaData = {
    customMetadata: {
      eventId, path, user,
    },
  };

  const fileName = file.name;
  const uploadTask = ImagesRef.child(`${path}/${eventId}/${fileName}`).put(file, metaData);

  uploadTask.on('state_changed', (snapshot) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    callback({ progress });
  }, (error) => {
    callback({ error });
  }, () => {
    const { downloadURL, metadata } = uploadTask.snapshot;
    callback({ downloadURL, metadata });
  });
}
