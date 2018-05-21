import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  Row,
  Col,
  Badge,
  Card,
  CardText,
  CardBody,
  CardFooter,
  CardImg,
  CardTitle,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import ErrorMessages from '../../constants/errors';
import Loading from './Loading';
import Error from './Error';
import Comments from './Comments';
import PostNew from './PostNew';
import EventNavBar from './EventNavBar';

const EventView = (props) => {
  const {
    locale,
    location,
    currentUser,
    error,
    loading,
    events,
    eventId,
    commentId,
    addComment,
    addPost,
    likeFn,
    uploadFn,
    participants,
    wpUsers,
    posts,
    notes,
  } = props;

  // Loading
  if (loading) return <Loading />;

  // Error
  if (error) return <Error content={error} />;

  // Get this event from all events
  let event = null;
  if (eventId && events) {
    event = events.find(item => parseInt(item.id, 10) === parseInt(eventId, 10));
  }

  // event not found
  if (!event) return <Error content={ErrorMessages.event404} />;

  const isPit = location.pathname.indexOf('notes') >= 0;

  const timeline = (!isPit && ((posts.length && posts) || event.posts)) || event.notes;

  const Avatar = ({ user, style }) => {
    if (!wpUsers[user] || !wpUsers[user].avatar) return <div className="avatar-icon" style={style}><i className="icon-user" style={{ fontSize: 40 }} /></div>
    return (
      <div style={style} className="avatar-img">
        { 
          !!wpUsers[user] && wpUsers[user].avatar && 
          <img alt="" src={wpUsers[user].avatar} />
        }
      </div>
    )
  };

  const newComment = (post, content) => {
    addComment({
      user: currentUser,
      content,
      eventId,
      postId: post.id,
    });
  };

  const toggleLike = (post) => {
    likeFn({
      user: currentUser,
      eventId,
      postId: post.id,
    });
  };

  const newPost = (post) => {
    addPost({
      ...post,
      eventId,
      username: wpUsers[currentUser].display_name,
    });
  };

  const styles = {
    topBanner: {
      position: 'fixed',
      top: '3.4rem',
      left: 0,
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

  const dateFormat = (datetime) => {
    if (!datetime) return '';
    moment.locale(locale || 'pt');
    const formattedDate = moment(datetime).calendar();
    return formattedDate || '';
  };

  // Build Cards for Listing
  const cards = timeline.slice(0).reverse().map(post => (
    post.username &&
    <Card style={{ marginTop: 60 }} key={`${post.id}`}>
      {!!post.media && !!post.media[0] && !!post.media[0].src && (
        post.media[0].type && post.media[0].type.indexOf('vid') >= 0 ?
          <div className="post-video"><video width="100%" controls><track kind="captions" /><source src={post.media[0].src} type={post.media[0].type} /></video></div>
        :
          <CardImg top src={post.media[0].src} />
      )}
      <CardBody style={styles.cardBody}>
        <Badge style={styles.dateTime}>{dateFormat(post.datetime)}</Badge>
        <Avatar style={styles.avatar} user={post.user}/>
        <CardTitle style={styles.userName}>{post.username}</CardTitle>
        <CardText style={{ fontSize: 13 }}>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </CardText>
        {(isPit && post.action_link && (
          <CardFooter style={{ fontSize: 13 }}>
            <a href="post.action_link">{post.action_link}</a>
          </CardFooter>
        )) || null
        }
      </CardBody>
      <Comments
        wpUsers={wpUsers} 
        commentId={commentId.toString()}
        currentUser={currentUser} 
        post={post} 
        onSubmit={newComment} 
        onLike={toggleLike} 
        {...props} 
      />
    </Card>
  ));

  // Show Listing
  return (
    <div>
      <Row>
        <Col sm="12" className="pl-0 pr-0">
          <Card style={styles.mainCard}>
            <div style={styles.topBanner}>
              <CardImg top src={event.banner} alt={event.title} />
            </div>
            <CardBody>
              <CardTitle>{event.title}</CardTitle>
              <CardText>{event.description}</CardText>
            </CardBody>
            { (!isPit && (
              <CardFooter style={{ fontSize: 13 }}>
                <PostNew
                  user={currentUser}
                  eventId={eventId}
                  onSubmit={newPost}
                  uploadFn={uploadFn}
                  {...props}
                />
              </CardFooter>
            )) || null
            }
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
      />
    </div>
  );
};

EventView.propTypes = {
  locale: PropTypes.string,
  error: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  eventId: PropTypes.number.isRequired,
  events: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  posts: PropTypes.arrayOf(PropTypes.shape()),
  notes: PropTypes.arrayOf(PropTypes.shape()),
  commentId: PropTypes.string,
  addComment: PropTypes.func.isRequired,
  addPost: PropTypes.func.isRequired,
  likeFn: PropTypes.func.isRequired,
  uploadFn: PropTypes.func.isRequired,
  location: PropTypes.shape(),
  participants: PropTypes.shape(),
  wpUsers: PropTypes.shape(),
  currentUser: PropTypes.number,
};

EventView.defaultProps = {
  currentUser: 1,
  commentId: '1',
  locale: null,
  error: null,
  location: {},
  participants: {},
  posts: [],
  notes: [],
  wpUsers: {},
};

export default EventView;
