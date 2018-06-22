import React from 'react';
import PropTypes from 'prop-types';
import { Nav, NavItem, Badge } from 'reactstrap';
import { Link } from 'react-router-dom';


const scrollToTop = () => {
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      window.scrollTo({ top: 0 });
    }, 100);
  }
};

const styles = {
  link: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: '8px',
    right: '50%',
    marginRight: '-30px',
    height: '15px',
    width: 'auto',
    lineHeight: '1.3',
    textAlign: 'center',
    padding: '3px',
    fontSize: '9px',
    backgroundColor: '#fff',
    color: '#ee1d67',
  },
};

const EventNavBar = (props) => {
  const {
    eventId,
    pathname,
    postsLen,
    notesLen,
    participantsLen,
  } = props;

  return (
    <Nav
      className="footer-navar"
      navbar
      style={{
            position: 'fixed',
            zIndex: 1000,
            bottom: 0,
            left: 0,
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
        }}
    >
      <NavItem style={{ flex: 1 }}>
        <Link
          style={styles.link}
          onClick={() => scrollToTop()}
          className={`nav-link bg-primary text-white text-center ${pathname && (pathname.indexOf('notes') < 0 && pathname.indexOf('participants') < 0) && 'active'}`}
          to={`/event/${eventId}`}
        >
          <i className="icon-note" />
          {(postsLen && <Badge style={styles.badge} pill>{postsLen}</Badge>) || null }
        </Link>
      </NavItem>
      <NavItem style={{
            flex: 1,
            borderLeftWidth: '1px',
            borderLeftColor: 'rgba(255,255,255,0.9)',
            borderLeftStyle: 'solid',
        }}
      >
        <Link
          style={styles.link}
          onClick={() => scrollToTop()}
          className={`nav-link bg-primary text-white text-center ${pathname && pathname.indexOf('notes') > 0 && 'active'}`}
          to={`/event/${eventId}/notes`}
        >
          <i className="icon-bell" />
          {(notesLen && <Badge style={styles.badge} pill>{notesLen}</Badge>) || null }
        </Link>
      </NavItem>
      <NavItem style={{
            flex: 1,
            borderLeftWidth: '1px',
            borderLeftColor: 'rgba(255,255,255,0.9)',
            borderLeftStyle: 'solid',
        }}
      >
        <Link
          style={styles.link}
          onClick={() => scrollToTop()}
          className={`nav-link bg-primary text-white text-center ${pathname && pathname.indexOf('participants') > 0 && 'active'}`}
          to={`/event/${eventId}/participants`}
        >
          <i className="icon-people" />
          {(participantsLen && <Badge style={styles.badge} pill>{participantsLen}</Badge>) || null }
        </Link>
      </NavItem>
    </Nav>
  );
};

EventNavBar.propTypes = {
  pathname: PropTypes.string,
  eventId: PropTypes.number.isRequired,
  postsLen: PropTypes.number,
  notesLen: PropTypes.number,
  participantsLen: PropTypes.number,
};

EventNavBar.defaultProps = {
  pathname: '',
  postsLen: 0,
  notesLen: 0,
  participantsLen: 0,
};

export default EventNavBar;
