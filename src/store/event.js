export default {
  loading: true,
  listening: false,
  loader: false,
  error: null,
  upload: {
    uploading: false,
    metadata: {},
    progress: 0,
    error: '',
  },
  events: [],
  posts: [],
  notes: [],
  wpUsers: {
    0: {
      placeholder: true,
      id: 0,
      ID: 0,
      user_id: 0,
      celular: '-- ----- -----',
      display_name: '-------- ----------',
      email: '----------@--------.-----',
      first_name: '-------- ----------',
      last_name: '----------',
      login: '---------',
      qrcode: ' [ ------------------ ] ',
    },
  },
  eventId: 0,
  event: {
    placeholder: true,
    id: 0,
    dbid: 0,
    ativo: 0,
    banner: 'https://firebasestorage.googleapis.com/v0/b/br-com-qiplus.appspot.com/o/live%2Fplaceholder.jpg?alt=media&token=ffc50e93-6284-4ac0-8e98-d4825fd0e3ed',
    title: '---- --- -- ------',
    description: '---- --- -- ------ ---- --- -- ------ ---- --- -- ------ ---- --- -- ------',
    participants: {
      '----': true,
      '--_--': true,
    },
    lojas: [],
    posts: [
      {
        content: '---- --- -- ------ ---- --- -- ------',
        media: [{
          type: '',
          src: 'https://firebasestorage.googleapis.com/v0/b/br-com-qiplus.appspot.com/o/live%2Fplaceholder.jpg?alt=media&token=ffc50e93-6284-4ac0-8e98-d4825fd0e3ed',
        }],
      },
    ],
    notes: [
      {
        content: '---- --- -- ------ ---- --- -- ------',
        media: [{
          type: '',
          src: 'https://firebasestorage.googleapis.com/v0/b/br-com-qiplus.appspot.com/o/live%2Fplaceholder.jpg?alt=media&token=ffc50e93-6284-4ac0-8e98-d4825fd0e3ed',
        }],
      },
    ],
  },
};
