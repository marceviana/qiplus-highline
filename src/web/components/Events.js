import React from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  Button,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import Error from './Error';
import { translate } from '../../i18n';

const EventListing = ({ error, loading, events, eventSetter }) => {
  // Error
  if (error) return <Error content={error} />;

  // Build Cards for Listing
  const cards = events.map(item => (
    <Card key={`${item.id}`}>
      <Link onClick={() => eventSetter(item.id)} to={`/event/${item.id}`}>
        <CardImg top src={item.banner} alt={item.title} />
      </Link>
      <CardBody>
        <CardTitle>{item.title}</CardTitle>
        <CardText>{item.description}</CardText>
        <Link onClick={() => eventSetter(item.id)} className="btn btn-primary" to={`/event/${item.id}`}>{translate('view_event')}<i className="icon-arrow-right" /></Link>
      </CardBody>
    </Card>
  ));

  // Show Listing
  return (
    <div>
      <Row>
        <Col sm="12">
          <h1>{translate('events')}</h1>
        </Col>
      </Row>
      <Row className={loading ? 'content-loading' : ''}>
        <Col sm="12" className="card-columns">
          {cards}
        </Col>
      </Row>
    </div>
  );
};

EventListing.propTypes = {
  error: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  events: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  eventSetter: PropTypes.func.isRequired,
};

EventListing.defaultProps = {
  error: null,
};

export default EventListing;
