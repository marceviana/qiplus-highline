import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { listenToPosts, listenToNotes, getParticipants, setParticipantsError, addComment, addPost, getPosts, uploadFile, toggleLike } from '../actions/event';

const extractParticipantIds = ({ posts, notes }) => {
  let users = [];
  if (posts && posts.length) {
    users = users.concat(posts.map(item => item.user));
  }
  if (notes && notes.length) {
    users = users.concat(notes.map(item => item.user));
  }
  return [...(new Set(users))];
};

const extractId = ({ id }) => id;

class EventView extends Component {
  static propTypes = {
    locale: PropTypes.string,
    location: PropTypes.shape(),
    tab: PropTypes.string,
    Layout: PropTypes.func.isRequired,
    event: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      loadingData: PropTypes.bool,
      error: PropTypes.string,
      wpUsers: PropTypes.shape().isRequired,
      event: PropTypes.shape().isRequired,
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({}),
    }),
    upload: PropTypes.shape({
      uploading: PropTypes.bool,
      metadata: PropTypes.shape(),
      progress: PropTypes.number,
      error: PropTypes.string,
    }),
    member: PropTypes.shape().isRequired,
    posts: PropTypes.arrayOf(PropTypes.shape()),
    notes: PropTypes.arrayOf(PropTypes.shape()),
    listenToPosts: PropTypes.func.isRequired,
    listenToNotes: PropTypes.func.isRequired,
    getParticipants: PropTypes.func.isRequired,
    setParticipantsError: PropTypes.func.isRequired,
    addComment: PropTypes.func.isRequired,
    addPost: PropTypes.func.isRequired,
    getPosts: PropTypes.func.isRequired,
    uploadFile: PropTypes.func.isRequired,
    toggleLike: PropTypes.func.isRequired,
  }

  static defaultProps = {
    locale: null,
    match: null,
    tab: '',
    posts: [],
    notes: [],
    location: {},
    upload: {
      uploading: false,
      metadata: {},
      progress: 100,
      error: '',
    },
  }

  componentDidMount = () => {
    const { event } = this.props.event;
    const { posts, notes } = this.props;
    this.props.listenToPosts(extractId(event));
    this.props.listenToNotes(extractId(event));
    this.fetchUsers(extractParticipantIds({ posts, notes }));
  };

  newComment = commentData =>
    this.props.addComment(commentData)
  // .then(this.props.getPosts(commentData));

  newPost = postData =>
    this.props.addPost(postData)
  // .then(this.props.getPosts(postData));

  toggleLike = postData =>
    this.props.toggleLike(postData)
  // .then(this.props.getPosts(postData));

  /**
    * Fetch Data from API, saving to Redux
    */
  fetchUsers = participantIds => this.props.getParticipants(participantIds)
    .then()
    .catch((err) => {
      console.log(`Error: ${err}`);
      return this.props.setParticipantsError(err);
    })

  render = () => {
    const {
      Layout, location, event, locale, match, member, posts, notes, upload,
    } = this.props;
    const id = (match && match.params && match.params.id) ? match.params.id : null;
    const tab = (match && match.params && match.params.tab) ? match.params.tab : 'liveposts';
    return (
      <Layout
        location={location || { pathname: (match && match.params && match.params.url) || '/' }}
        eventId={Number(id)}
        currentUser={Number(member.id)}
        event={event.event}
        activeTab={tab}
        upload={upload}
        locale={locale}
        posts={posts}
        notes={notes}
        error={event.error}
        loading={event.loading}
        loadingData={event.loadingData}
        member={member}
        likeFn={this.toggleLike}
        uploadFn={this.props.uploadFile}
        wpUsers={event.wpUsers}
        addComment={this.newComment}
        addPost={this.newPost}
      />
    );
  }
}

const mapStateToProps = state => ({
  locale: state.locale || null,
  member: state.member || {},
  posts: state.event.posts || {},
  notes: state.event.notes || {},
  upload: state.event.upload || {},
  event: state.event || {},
});

const mapDispatchToProps = {
  listenToPosts,
  listenToNotes,
  toggleLike,
  uploadFile,
  addComment,
  addPost,
  getPosts,
  getParticipants,
  setParticipantsError,
};

export default connect(mapStateToProps, mapDispatchToProps)(EventView);
