import React from 'react';
import PropTypes from 'prop-types';

import {
  Row,
  Col,
  Card,
  CardText,
  CardBody,
  CardImg,
  CardTitle,
} from 'reactstrap';

import ErrorMessages from '../../constants/errors';
import EventNavBar from './EventNavBar';
import Loading from './Loading';
import Error from './Error';
import Avatar from './Avatar';

const styles = {
  topBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  mainCard: {
    zIndex: 100,
    paddingTop: '33.333%',
  },
  cardBody: {
    position: 'relative',
    fontSize: 12,
  },
  userName: {
    position: 'relative',
    paddingLeft: 60,
    fontSize: 14,
    top: -10,
  },
  dateTime: {
    position: 'absolute',
    top: -6,
    right: 5,
    fontWeight: 100,
    borderRadius: 5,
  },
  label: {
    position: 'relative',
    padding: '0 5px',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: -5,
    height: 15,
    lineHeight: 1.5,
  },
  button: {
    borderRadius: '50%',
    border: '1px solid',
  },
  avatar: {
    position: 'absolute',
    left: 15,
    top: -30,
    background: '#fff',
    borderRadius: 60,
    width: 60,
    height: 60,
    textAlign: 'center',
    overflow: 'hidden',
    boxShadow: '0 0 2px #999',
  },
};

const ParticipantsView = (props) => {
  const {
    location,
    currentUser,
    error,
    loading,
    member,
    event,
    eventId,
    wpUsers,
  } = props;

  // Loading
  if (loading) return <Loading />;

  // Error
  if (error) return <Error content={error} />;

  // event not found
  if (!event || !event.id) return <Error content={ErrorMessages.event404} />;

  const participants = Object.keys(wpUsers).map(id => ({
    id: wpUsers[id].dbid,
    ...wpUsers[id],
  }));

  const cards = participants.slice(0).reverse().map(user => (
    user.first_name &&
    <Card style={{ marginTop: 45 }} key={`${user.ID}`}>
      <CardBody style={styles.cardBody}>
        <Avatar style={styles.avatar} user={Number(user.ID)} />
        <CardTitle style={styles.userName}>{user.first_name}</CardTitle>
        <CardText style={{ fontSize: 13 }}>
          <span>{user.first_name}}</span>
        </CardText>
      </CardBody>
    </Card>
  ));

  return (
    <div>
      <Row>
        <Col sm="12" className="pl-0 pr-0">
          <Card className="header-card" style={styles.mainCard}>
            <div className="header-banner" style={styles.topBanner}>
              <CardImg top src={event.banner} alt={event.title} />
            </div>
            <CardBody>
              <CardTitle>{event.title}</CardTitle>
              <CardText>{event.description}</CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row className={loading ? 'content-loading' : ''}>
        <Col sm="12" className="card-columns">
          {cards}
        </Col>
      </Row>
      <EventNavBar
        eventId={eventId}
        pathname={location.pathname}
        postsLen={(event.posts && event.posts.length) || 0}
        notesLen={(event.notes && event.notes.length) || 0}
        participantsLen={(event.participants && Object.keys(event.participants).length) || 0}
      />
    </div>
  );
};

ParticipantsView.propTypes = {
  location: PropTypes.shape(),
  error: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  eventId: PropTypes.number.isRequired,
  event: PropTypes.shape().isRequired,
  member: PropTypes.shape().isRequired,
  wpUsers: PropTypes.shape(),
  currentUser: PropTypes.number,
};

ParticipantsView.defaultProps = {
  currentUser: 0,
  error: null,
  location: {},
  wpUsers: {},
};

export default ParticipantsView;
