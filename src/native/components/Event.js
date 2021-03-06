import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/locale/pt-br';

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import { Video } from 'expo';
import { FlatList, RefreshControl, Image, StyleSheet, View } from 'react-native';
import { Container, Content, Card, CardItem, Body, H3, Text, Spinner, Left, Thumbnail } from 'native-base';
import ErrorMessages from '../../constants/errors';
import Loading from './Loading';
import Error from './Error';
import Spacer from './Spacer';
import Comments from './Comments';
import PostNew from './PostNew';

const styles = StyleSheet.create({
  dateTime: {
    position: 'absolute',
    top: 3,
    right: 5,
    fontWeight: '100',
    fontSize: 10,
    borderRadius: 5,
  },
  userName: {
    position: 'relative',
    paddingLeft: 70,
    top: 0,
  },
  avatarIcon: {
    margin: 10,
  },
  avatarThumbnail: {
    borderRadius: 72,
    width: 72,
    height: 72,
  },
  avatar: {
    position: 'absolute',
    left: 10,
    top: 5,
    backgroundColor: '#fff',
    borderRadius: 72,
    width: 72,
    height: 72,
    borderColor: '#ededed',
    borderWidth: 1,
    zIndex: 1,
  },
  cardWrapper: {
    position: 'relative',
    marginTop: 20,
    paddingTop: 30,
  },
});

export const Media = ( media ) => (media && media[0] && media[0].src && (
  media[0].type && media[0].type.indexOf('vid') >= 0 ?
    <Video
      source={{ uri: media[0].src }}
      shouldPlay
      resizeMode="cover"
      style={{ flex: 1, height: 300 }}
    />
    :
    <Left>
      <Image source={{ uri: media[0].src }} />
    </Left>
)) || <Text>{' '}</Text>;

const EventView = (props) => {
  const {
    locale,
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
    reFetch,
    reFetchUsers,
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

  const Avatar = ({ user, style }) => {
    if (!wpUsers[user] || !wpUsers[user].avatar) return <View style={style}><FontAwesomeIcon style={styles.avatarIcon} size={50} name="user-circle-o" /></View>;
    return (
      <View style={style}>
        {
          !!wpUsers[user] && wpUsers[user].avatar &&
          <Thumbnail style={styles.avatarThumbnail} source={{ uri: wpUsers[user].avatar }} />
        }
      </View>
    );
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

  const dateFormatter = (datetime) => {
    if (!datetime) return '';
    moment.locale(locale || 'pt');
    const formattedDate = moment(datetime).calendar();
    return formattedDate || '';
  };

  const keyExtractor = item => (item.id && item.id.toString()) || '';

  let loaded = 10;

  const loadMore = () => {
    loaded += 10;
  };

  const timeline = (posts.length && posts) || event.posts;

  return (
    <Container>
      <Content padder>
        <Image source={{ uri: event.banner }} style={{ height: 250, width: null, flex: 1 }} />

        <Spacer size={25} />
        <H3>{event.title}</H3>
        {!!event.organizers && event.organizers.length && <Text>{event.organizers.join(' & ')}</Text>}
        <Spacer size={15} />

        <Card>
          <CardItem>
            <Body>
              <Text>{event.description}</Text>
            </Body>
          </CardItem>
          <CardItem>
            <PostNew
              user={currentUser}
              eventId={eventId}
              onSubmit={newPost}
              uploadFn={uploadFn}
              {...props}
            />
          </CardItem>
        </Card>

        <Spacer size={20} />

        {!!loading && <Spinner color="blue" />}

        {!!timeline && !!timeline.length && <FlatList
          numColumns={1}
          data={timeline.slice(0).reverse()}
          renderItem={({ item, index }) => (
            !!item.username && index < loaded &&
            <View style={ styles.cardWrapper }>
              <Media media={item.media} />
              <Avatar style={styles.avatar} user={item.user} />
              <Card transparent style={{ position: 'relative', paddingHorizontal: 6, zIndex: 0 }}>
                <CardItem>
                  <Text note style={styles.dateTime}>{dateFormatter(item.datetime)}</Text>
                  <Body style={styles.userName}>
                    <Text style={{ fontWeight: 'bold' }}>{item.username}</Text>
                  </Body>
                </CardItem>
                <CardItem cardBody>
                  <Body style={{ padding: 10 }}>
                    <Spacer size={10} />
                    <Text>{item.content}</Text>
                    <Spacer size={15} />
                  </Body>
                </CardItem>
                <Comments
                  wpUsers={wpUsers}
                  commentId={commentId.toString()}
                  currentUser={currentUser}
                  post={item}
                  onSubmit={newComment}
                  onLike={toggleLike}
                  {...props}
                />
              </Card>
            </View>
          )}
          keyExtractor={keyExtractor}
          onEndReached={loadMore}
          onEndReachedThreshold={1}
        /> }

        <Spacer size={20} />

      </Content>
    </Container>
  );
};

EventView.propTypes = {
  locale: PropTypes.string,
  error: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  eventId: PropTypes.number.isRequired,
  events: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  posts: PropTypes.arrayOf(PropTypes.shape()),
  commentId: PropTypes.string,
  addComment: PropTypes.func.isRequired,
  addPost: PropTypes.func.isRequired,
  likeFn: PropTypes.func.isRequired,
  uploadFn: PropTypes.func.isRequired,
  participants: PropTypes.shape(),
  wpUsers: PropTypes.shape(),
  currentUser: PropTypes.number,
};

EventView.defaultProps = {
  currentUser: 1,
  commentId: '1',
  locale: null,
  error: null,
  participants: {},
  posts: [],
  wpUsers: {},
};

export default EventView;
