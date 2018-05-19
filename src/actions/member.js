import ErrorMessages from '../constants/errors';
import statusMessage from './status';
import { Firebase, FirebaseRef } from '../lib/firebase';
import { getFileExt, getMediaType } from '../lib/functions';

/**
  * Sign Up to Firebase
  */
export function signUp(formData) {
  const {
    email,
    password,
    password2,
    firstName,
    lastName,
  } = formData;

  return dispatch => new Promise(async (resolve, reject) => {
    // Validation checks
    if (!firstName) return reject({ message: ErrorMessages.missingFirstName });
    if (!lastName) return reject({ message: ErrorMessages.missingLastName });
    if (!email) return reject({ message: ErrorMessages.missingEmail });
    if (!password) return reject({ message: ErrorMessages.missingPassword });
    if (!password2) return reject({ message: ErrorMessages.missingPassword });
    if (password !== password2) return reject({ message: ErrorMessages.passwordsDontMatch });

    await statusMessage(dispatch, 'loading', true);

    // Go to Firebase
    return Firebase.auth()
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        // Send user details to Firebase database
        if (res && res.uid) {
          FirebaseRef.child(`users/${res.uid}`).set({
            firstName,
            lastName,
            signedUp: Firebase.database.ServerValue.TIMESTAMP,
            lastLoggedIn: Firebase.database.ServerValue.TIMESTAMP,
          }).then(() => statusMessage(dispatch, 'loading', false).then(resolve));
        }
      }).catch(reject);
  }).catch(async (err) => { await statusMessage(dispatch, 'error', err.message); throw err.message; });
}

/**
  * Get this User's Details
  */
function getWPUserData(dispatch) {
  const email = (
    FirebaseRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.email
  ) ? Firebase.auth().currentUser.email : null;

  if (!email) return false;

  const wpUsersRef = FirebaseRef.child('wp_users');

  return wpUsersRef.orderByChild('email').equalTo(email).once('value', (snapshot) => {
    console.log(snapshot.val());
    const userData = snapshot.val() || [];
    console.log('userData', userData);
    console.log('snapshot', snapshot);

    return dispatch({
      type: 'USER_DETAILS_UPDATE',
      data: userData,
    });
  });
}

/**
  * Get this User's Details
  */
function getUserData() {
  const UID = (
    FirebaseRef
    && Firebase
    && Firebase.auth()
    && Firebase.auth().currentUser
    && Firebase.auth().currentUser.uid
  ) ? Firebase.auth().currentUser.uid : null;

  if (!UID) return false;

  const ref = FirebaseRef.child(`users/${UID}`);

  return dispatch => new Promise(resolve => ref.on('value', (snapshot) => {
    const userData = snapshot.val() || [];
    if (userData) {
      return resolve(getWPUserData(dispatch));
    }

    return () => new Promise(() => resolve());
  }));
}

export function getMemberData() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  // Ensure token is up to date
  return dispatch => new Promise((resolve) => {
    Firebase.auth().onAuthStateChanged((loggedIn) => {
      if (loggedIn) {
        return resolve(getUserData(dispatch));
      }

      return () => new Promise(() => resolve());
    });
  });
}

/**
  * Login to Firebase with Email/Password
  */
export function login(formData) {
  const {
    email,
    password,
  } = formData;

  return dispatch => new Promise(async (resolve, reject) => {
    await statusMessage(dispatch, 'loading', true);

    // Validation checks
    if (!email) return reject({ message: ErrorMessages.missingEmail });
    if (!password) return reject({ message: ErrorMessages.missingPassword });

    // Go to Firebase
    return Firebase.auth()
      .setPersistence(Firebase.auth.Auth.Persistence.LOCAL)
      .then(() =>
        Firebase.auth()
          .signInWithEmailAndPassword(email, password)
          .then(async (res) => {
            if (res && res.uid) {
              // Update last logged in data
              FirebaseRef.child(`users/${res.uid}`).update({
                lastLoggedIn: Firebase.database.ServerValue.TIMESTAMP,
              });

              // Send verification Email when email hasn't been verified
              if (res.emailVerified === false) {
                Firebase.auth().currentUser
                  .sendEmailVerification()
                  .catch(() => console.log('Verification email failed to send'));
              }

              // Get User Data
              getUserData(dispatch);
            }

            await statusMessage(dispatch, 'loading', false);

            // Send Login data to Redux
            return resolve(dispatch({
              type: 'USER_LOGIN',
              data: res,
            }));
          }).catch(reject));
  }).catch(async (err) => { await statusMessage(dispatch, 'error', err.message); throw err.message; });
}

/**
  * Reset Password
  */
export function resetPassword(formData) {
  const { email } = formData;

  return dispatch => new Promise(async (resolve, reject) => {
    // Validation checks
    if (!email) return reject({ message: ErrorMessages.missingEmail });

    await statusMessage(dispatch, 'loading', true);

    // Go to Firebase
    return Firebase.auth()
      .sendPasswordResetEmail(email)
      .then(() => statusMessage(dispatch, 'loading', false).then(resolve(dispatch({ type: 'USER_RESET' }))))
      .catch(reject);
  }).catch(async (err) => { await statusMessage(dispatch, 'error', err.message); throw err.message; });
}

/**
  * Update Profile
  */
export function updateProfile(formData) {
  const {
    email,
    password,
    password2,
    firstName,
    lastName,
    changeEmail,
    changePassword,
  } = formData;

  return dispatch => new Promise(async (resolve, reject) => {
    // Are they a user?
    const UID = Firebase.auth().currentUser.uid;
    if (!UID) return reject({ message: ErrorMessages.missingFirstName });

    // Validation checks
    if (!firstName) return reject({ message: ErrorMessages.missingFirstName });
    if (!lastName) return reject({ message: ErrorMessages.missingLastName });
    if (changeEmail) {
      if (!email) return reject({ message: ErrorMessages.missingEmail });
    }
    if (changePassword) {
      if (!password) return reject({ message: ErrorMessages.missingPassword });
      if (!password2) return reject({ message: ErrorMessages.missingPassword });
      if (password !== password2) return reject({ message: ErrorMessages.passwordsDontMatch });
    }

    await statusMessage(dispatch, 'loading', true);

    // Go to Firebase
    return FirebaseRef.child(`users/${UID}`).update({ firstName, lastName })
      .then(async () => {
        // Update Email address
        if (changeEmail) {
          await Firebase.auth().currentUser.updateEmail(email).catch(reject);
        }

        // Change the password
        if (changePassword) {
          await Firebase.auth().currentUser.updatePassword(password).catch(reject);
        }

        // Update Redux
        await getUserData(dispatch);
        await statusMessage(dispatch, 'success', 'Profile Updated');
        resolve();
      }).catch(reject);
  }).catch(async (err) => { await statusMessage(dispatch, 'error', err.message); throw err.message; });
}

/**
  * Logout
  */
export function logout() {
  return dispatch => new Promise((resolve, reject) => {
    Firebase.auth().signOut()
      .then(() => {
        dispatch({ type: 'USER_RESET' });
        setTimeout(resolve, 1000);
      }).catch(reject);
  }).catch(async (err) => { await statusMessage(dispatch, 'error', err.message); throw err.message; });
}

/**
  * LoginWP
  */
// export function loginWP(formData) {
//   const {
//     email,
//     password,
//   } = formData;

//   return dispatch => new Promise(async (resolve, reject) => {
//     await statusMessage(dispatch, 'loading', true);

//     // Validation checks
//     if (!email) return reject({ message: ErrorMessages.missingEmail });
//     if (!password) return reject({ message: ErrorMessages.missingPassword });

//     const data = { action: 'app_login', username: email, password }; // wp ajax action

//     $.ajax({
//       type: 'GET', // this is the essence of jsonp
//       url: APP_URL, // wp ajax url
//       cache: false, // to ensure proper data response
//       dataType: 'jsonp', // jsonp
//       crossDomain: true, // enable ssl/nonssl
//       data, // data to be sent
//       success(dataJSON) => {
//         const { conEstado } = dataJSON;

//         if (Number(conEstado) === 1) {
//           localStorage.setItem('conEstado', 1);

//           dataJSON.user = email;
//           dataJSON.pass = password;

//           localJSON.set('meusdados', dataJSON);
//           localStorage.setItem('userID', dataJSON.userID);
//           localStorage.setItem('pp', pass);

//           // console.log(dataJSON.user_avatar);
//           let downloadAvatar = false;
//           if (dataJSON.user_avatar && dataJSON.user_avatar.url) {
//             downloadAvatar = true;
//             const url = dataJSON.user_avatar.sizes.large
//               ? dataJSON.user_avatar.sizes.large
//               : dataJSON.user_avatar.url;
//             const ext = getFileExt(url);
//             const fileName = 'user_avatar' + '.' + ext;

//             window.requestFileSystem(
//               window.PERSISTENT,
//               5 * 1024 * 1024,
//               (fs) => {
//                 const id = dataJSON.userID;
//                 const tipo = 'usuarios';
//                 const field = 'user_avatar';
//                 const fileID = `image-${  tipo  }-id-${  id  }-field-${  field}`;

//                 const fileData = {
//                   id,
//                   tipo,
//                   field,
//                   ext,
//                   modified: dataJSON.user_avatar.modified,
//                   url,
//                   fileID,
//                   fileName,
//                   media: getMediaType(dataJSON.user_avatar.mime_type),
//                   description: '',
//                 };

//                 downloadFile(
//                   fs,
//                   fileName,
//                   url,
//                   fileData,
//                   (fileSrc) => {
//                     localStorage.setItem('user_avatar', fileSrc);
//                     login();
//                   },
//                   (src) => {
//                     console.log('error-----AVATAR IMG');
//                     console.log(src);
//                     localStorage.setItem('user_avatar', '');
//                     login();
//                   },
//                 );
//               },
//             );
//           } else {
//             localStorage.setItem('user_avatar', '');
//           }

//           if ('horarioIniStr' in dataJSON) {
//             localStorage.setItem('horarioIniStr', dataJSON.horarioIniStr);
//             localStorage.setItem('horarioFinStr', dataJSON.horarioFinStr);
//           }

//           if ('quemSomosStr' in dataJSON) {
//             localStorage.setItem('quemSomosStr', dataJSON.quemSomosStr);
//           }

//           if ('ajaxurl' in dataJSON) {
//             localStorage.setItem('ajaxurl', dataJSON.ajaxurl);
//             ajaxurl = dataJSON.ajaxurl;
//           }

//           if ('all_fields' in dataJSON) {
//             localJSON.set('all_fields', dataJSON.all_fields);
//           }
//           if ('extra_fields' in dataJSON) {
//             localJSON.set('extra_fields', dataJSON.extra_fields);
//           }
//           if ('wpuser_fields' in dataJSON) {
//             localJSON.set('wpuser_fields', dataJSON.wpuser_fields);
//           }
//           if ('indexed_fields' in dataJSON) {
//             localJSON.set('indexed_fields', dataJSON.indexed_fields);
//           }

//           if (!downloadAvatar) login();
//         } else if (conEstado == 0) {
//           statusMessage(dispatch, 'error', 'Dados incorretos. Tente novamente.');
//           localStorage.setItem('conEstado', 0);
//         }
//       },

//     });
//   }).catch(async (err) => {
//     await statusMessage(dispatch, 'error', err.message);
//     throw err.message;
//   });
// }
