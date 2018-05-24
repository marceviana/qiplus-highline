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
} from 'reactstrap';
import { Link } from 'react-router-dom';
import Error from './Error';
import { translate } from '../../i18n';

const scrollToTop = () => {
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      window.scrollTo({ top: 0 });
    }, 100);
  }
};

const NoEvents = () => (
  <div>
    <h3>Ops...</h3>
    <p>Parece que você não está inscrito em nenuhum evento do Live QI Plus</p>
    <Link onClick={scrollToTop} to="/">
      Voltar ao início
    </Link>
  </div>
);

const EventListing = ({
  error, loading, events, eventSetter,
}) => {
  // Error
  if (error) return <Error content={error} />;

  // Build Cards for Listing
  const cards = events.map(item => (
    <Card key={`${item.id}`}>
      <Link onClick={() => { scrollToTop(); eventSetter(item.id); }} to={`/event/${item.id}`}>
        <CardImg top src={item.banner} alt={item.title} />
      </Link>
      <CardBody>
        <CardTitle>{item.title}</CardTitle>
        <CardText>{item.description}</CardText>
        <Link onClick={() => { scrollToTop(); eventSetter(item.id); }} className="btn btn-primary" to={`/event/${item.id}`}>{translate('view_event')}<i className="icon-arrow-right" /></Link>
      </CardBody>
    </Card>
  ));

  // Show Listing
  return (
    <div>
      <Row>
        <Col sm="12" className="pt-3">
          <h2>{translate('events')}</h2>
        </Col>
      </Row>
      <Row className={loading ? 'content-loading' : ''}>
        <Col sm="12" className="card-columns">
          {(events.length && cards) || <NoEvents />}
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
