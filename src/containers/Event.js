import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getEvents, setEventsError } from '../actions/events';
import { listenToEvent, getParticipants, setParticipantsError, addComment, addPost, getPosts, uploadFile, toggleLike } from '../actions/event';

const extractParticipantIds = ({ participants }) =>
  (participants && Object.keys(participants)) || [];

const extractId = ({ eventId }) => eventId;

class EventView extends Component {
  static propTypes = {
    locale: PropTypes.string,
    location: PropTypes.shape().isRequired,
    Layout: PropTypes.func.isRequired,
    events: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      error: PropTypes.string,
      events: PropTypes.arrayOf(PropTypes.shape()).isRequired,
      event: PropTypes.shape(),
      eventid: PropTypes.number,
    }).isRequired,
    event: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      loadingData: PropTypes.bool,
      error: PropTypes.string,
      wpUsers: PropTypes.shape().isRequired,
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({}),
    }),
    member: PropTypes.shape().isRequired,
    posts: PropTypes.arrayOf(PropTypes.shape()),
    listenToEvent: PropTypes.func.isRequired,
    getEvents: PropTypes.func.isRequired,
    getParticipants: PropTypes.func.isRequired,
    setEventsError: PropTypes.func.isRequired,
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
    posts: [],
  }

  componentDidMount = () => { 
    this.props.listenToEvent(extractId(this.props.events));
    this.fetchParticipants(extractParticipantIds(this.props.events.event));
  };

  newComment = commentData =>
    this.props.addComment(commentData).then(this.props.getPosts(extractId(this.props.events)));

  newPost = postData =>
    this.props.addPost(postData).then(this.props.getPosts(extractId(this.props.events)));

  toggleLike = postData =>
    this.props.toggleLike(postData).then(this.props.getPosts(extractId(this.props.events)));

  /**
    * Fetch Data from API, saving to Redux
    */
  fetchEvents = () => this.props.getEvents()
    .then(this.fetchParticipants(extractParticipantIds(this.props.events.event)))
    .catch((err) => {
      console.log(`Error: ${err}`);
      return this.props.setEventsError(err);
    })

  /**
    * Fetch Data from API, saving to Redux
    */
  fetchParticipants = participantIds => this.props.getParticipants(participantIds)
    .then()
    .catch((err) => {
      console.log(`Error: ${err}`);
      return this.props.setParticipantsError(err);
    })

  render = () => {
    const {
      Layout, location, events, event, locale, match, member, posts,
    } = this.props;
    const id = (match && match.params && match.params.id) ? match.params.id : null;
    return (
      <Layout
        location={location}
        events={events.events}
        eventId={Number(id)}
        locale={locale}
        posts={(posts.length && posts) || event.posts}
        error={event.error}
        loading={event.loading}
        loadingData={event.loadingData}
        member={member}
        likeFn={this.toggleLike}
        uploadFn={this.props.uploadFile}
        wpUsers={event.wpUsers}
        participants={events.event.participants}
        reFetch={() => this.fetchEvents()}
        reFetchUsers={() => this.fetchParticipants()}
        addComment={this.newComment}
        addPost={this.newPost}
      />
    );
  }
}

const mapStateToProps = state => ({
  locale: state.locale || null,
  events: state.events || {},
  event: state.event || {},
  member: state.member || {},
  posts: state.event.posts || {},
});

const mapDispatchToProps = {
  listenToEvent,
  toggleLike,
  uploadFile,
  addComment,
  addPost,
  getPosts,
  getEvents,
  getParticipants,
  setEventsError,
  setParticipantsError,
};

export default connect(mapStateToProps, mapDispatchToProps)(EventView);
