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
import ErrorMessages from '../../constants/errors';
import Loading from './Loading';
import Error from './Error';
import Comments from './Comments';
import PostNew from './PostNew';
import EventNavBar from './EventNavBar';
import Timer from './Timer';

export const dateFormatter = (datetime, locale = 'pt') => {
  if (!datetime) return '';
  moment.locale(locale);
  const formattedDate = moment(datetime).calendar();
  return formattedDate || '';
};

const EventView = (props) => {
  const {
    member,
    location,
    currentUser,
    error,
    loading,
    upload,
    event,
    eventId,
    addComment,
    addPost,
    likeFn,
    uploadFn,
    wpUsers,
    posts,
    notes,
  } = props;

  // Loading
  if (loading) return <Loading />;

  // Error
  if (error) return <Error content={error} />;

  // event not found
  if (!event) return <Error content={ErrorMessages.event404} />;

  const isPitch = location.pathname.indexOf('notes') >= 0;

  const timeline = isPitch ? notes : posts;

  const Avatar = ({ user, style }) => {
    if (!wpUsers[user] || !wpUsers[user].avatar) return <div className="avatar-icon" style={style}><i className="icon-user" style={{ fontSize: 40 }} /></div>;
    return (
      <div style={style} className="avatar-img">
        {
          !!wpUsers[user] && wpUsers[user].avatar &&
          <img alt="" src={wpUsers[user].avatar} />
        }
      </div>
    );
  };

  Avatar.propTypes = {
    user: PropTypes.number.isRequired,
    style: PropTypes.any,
  };

  Avatar.defaultProps = {
    style: {},
  };

  const ActionLink = ({ action_link, deadline }) => (
    isPitch && action_link && 
    (!deadline || new Date(deadline).getTime() < new Date().getTime()) && (
    <CardFooter style={{ fontSize: 13 }}>
      <Timer href={action_link} deadline={deadline} />
    </CardFooter>
    )) || null;

  ActionLink.propTypes = {
    action_link: PropTypes.string,
    deadline: PropTypes.string,
  };

  ActionLink.defaultProps = {
    action_link: '',
    deadline: '',
  };

  const newComment = (post, content) => {
    addComment({
      user: currentUser,
      content,
      eventId,
      postId: post.id,
      postType: (isPitch ? 'notes' : 'post'),
    });
  };

  const toggleLike = (post) => {
    likeFn({
      user: currentUser,
      eventId,
      postId: post.id,
      postType: (isPitch ? 'notes' : 'post'),
    });
  };

  const newPost = (post) => {
    addPost({
      ...post,
      eventId,
      username: member.display_name,
    });
  };

  const styles = {
    topBanner: {
      position: 'absolute',
      top: 0,
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
        <Badge className="bg-qi" style={styles.dateTime}>{dateFormatter(post.datetime)}</Badge>
        <Avatar style={styles.avatar} user={Number(post.user)} />
        <CardTitle style={styles.userName}>{post.username}</CardTitle>
        <CardText style={{ fontSize: 13 }}>
          <span dangerouslySetInnerHTML={{ __html: post.content }} />
        </CardText>
        <ActionLink post={post} />
      </CardBody>

      <Comments
        wpUsers={wpUsers}
        currentUser={currentUser}
        post={post}
        onSubmit={newComment}
        onLike={toggleLike}
        dateFormatter={dateFormatter}
        {...props}
      />
    </Card>
  ));

  // Show Listing
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
            { (!isPitch && (
              <CardFooter style={{ fontSize: 13 }}>
                <PostNew
                  upload={upload}
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
        postsLen={(posts && posts.length) || (event.posts && event.posts.length) || 0}
        notesLen={(notes && notes.length) || (event.notes && event.notes.length) || 0}
      />
    </div>
  );
};

EventView.propTypes = {
  locale: PropTypes.string,
  error: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  eventId: PropTypes.number.isRequired,
  event: PropTypes.shape().isRequired,
  member: PropTypes.shape().isRequired,
  posts: PropTypes.arrayOf(PropTypes.shape()),
  notes: PropTypes.arrayOf(PropTypes.shape()),
  addComment: PropTypes.func.isRequired,
  addPost: PropTypes.func.isRequired,
  likeFn: PropTypes.func.isRequired,
  uploadFn: PropTypes.func.isRequired,
  location: PropTypes.shape(),
  participants: PropTypes.shape(),
  wpUsers: PropTypes.shape(),
  upload: PropTypes.shape(),
  currentUser: PropTypes.number,
};

EventView.defaultProps = {
  currentUser: 0,
  locale: null,
  error: null,
  location: {},
  upload: {},
  participants: {},
  posts: [],
  notes: [],
  wpUsers: {},
};

export default EventView;
