import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getEvents, setEventsError, showLoader, eventSetter } from '../actions/events';

class EventListing extends Component {
  static propTypes = {
    locale: PropTypes.string,
    Layout: PropTypes.func.isRequired,
    events: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      loader: PropTypes.bool,
      error: PropTypes.string,
      events: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    }).isRequired,
    member: PropTypes.shape(),
    match: PropTypes.shape({
      params: PropTypes.shape({}),
    }),
    showLoader: PropTypes.func.isRequired,
    eventSetter: PropTypes.func.isRequired,
    getEvents: PropTypes.func.isRequired,
    setEventsError: PropTypes.func.isRequired,
  }

  static defaultProps = {
    member: {},
    locale: null,
    match: null,
  }

  componentDidMount = () => this.fetchEvents();

  /**
    * Fetch Data from API, saving to Redux
    */
  fetchEvents = () => this.props.getEvents()
    .catch((err) => {
      console.log(`Error: ${err}`);
      return this.props.setEventsError(err);
    })

  render = () => {
    const {
      Layout, events, locale, match, member,
    } = this.props;
    const id = (match && match.params && match.params.id) ? match.params.id : null;

    return (
      <Layout
        eventId={id}
        locale={locale}
        error={events.error}
        loader={events.loader}
        loading={events.loading}
        events={events.events}
        member={member}
        reFetch={() => this.fetchEvents()}
        eventLoader={this.props.showLoader}
        eventSetter={this.props.eventSetter}
      />
    );
  }
}

const mapStateToProps = state => ({
  locale: state.locale || null,
  events: state.events || {},
  member: state.member || {},
});

const mapDispatchToProps = {
  showLoader,
  getEvents,
  setEventsError,
  eventSetter,
};

export default connect(mapStateToProps, mapDispatchToProps)(EventListing);
