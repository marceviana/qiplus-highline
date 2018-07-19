import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getParticipants, setParticipantsError } from '../actions/event';

class ParticipantsListing extends Component {
  static propTypes = {
    locale: PropTypes.string,
    location: PropTypes.shape(),
    Layout: PropTypes.func.isRequired,
    event: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      loadingData: PropTypes.bool,
      error: PropTypes.string,
      wpUsers: PropTypes.shape().isRequired,
      event: PropTypes.shape({
        participants: PropTypes.shape(),
      }).isRequired,
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({}),
    }),
    member: PropTypes.shape().isRequired,
    getParticipants: PropTypes.func.isRequired,
    setParticipantsError: PropTypes.func.isRequired,
  }

  static defaultProps = {
    location: {},
    locale: null,
    match: null,
  }

    componentDidMount = () => {
      const { event } = this.props.event;
      setTimeout(() => this.fetchUsers(Object.keys(event.participants)), 1500)
    };

    fetchUsers = participantIds => this.props.getParticipants(participantIds)
      .then()
      .catch((err) => {
        console.log(`Error: ${err}`);
        return this.props.setParticipantsError(err);
      })

    render = () => {
      const {
        Layout, location, event, locale, match, member,
      } = this.props;
      const id = (match && match.params && match.params.id) ? match.params.id : null;

      return (
        <Layout
          locale={locale}
          location={location || { pathname: (match && match.params && match.params.url) || '/' }}
          eventId={Number(id)}
          currentUser={Number(member.id)}
          event={event.event}
          activeTab="participants"

          error={event.error}
          loader={event.loader}
          loading={event.loading}
          reFetch={() => this.fetchUsers(Object.keys(event.participants))}

          member={member}
          wpUsers={event.wpUsers}

        />
      );
    }
}

const mapStateToProps = state => ({
  locale: state.locale || null,
  events: state.events || {},
  member: state.member || {},
  event: state.event || {},
});

const mapDispatchToProps = {
  getParticipants,
  setParticipantsError,
};

export default connect(mapStateToProps, mapDispatchToProps)(ParticipantsListing);
