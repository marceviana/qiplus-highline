import React from 'react';
import { Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';

const scrollToTop = () => {
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      window.scrollTo({ top: 0 });
    }, 100);
  }
};

const About = () => (
  <div style={{
  backgroundColor: '#fff',
  marginLeft: '-15px',
  marginRight: '-15px',
  paddingLeft: '15px',
  paddingRight: '15px',
}}>
    <Row>
      <Col xs="12" className="pl-0 pr-0 text-center">
        <img className="img-fluid" src="http://qiplus.com.br/wp-content/uploads/recorte2.jpg" alt="QI Plus" />
      </Col>
      <Col xs="12" className="pt-3 pb-3">
        <hr />
        <p className="text-center">
          <Link to="/events" className="btn btn-primary" onClick={() => scrollToTop()}>
            <i className="icon-calendar" /> <span>Ver meus eventos no Live QI Plus</span>
          </Link>
        </p>
      </Col>
    </Row>
  </div>
);

export default About;
