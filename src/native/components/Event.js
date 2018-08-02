import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/locale/pt-br';

import { FlatList, RefreshControl, WebView, StyleSheet, View } from 'react-native';
import { Container, Content, Card, CardItem, Body, H3, Text, Spinner } from 'native-base';

import Colors from '../../../native-base-theme/variables/commonColor';
import ErrorMessages from '../../constants/errors';

import EventHeader from './EventHeader';
import EventFooter from './EventFooter';
import Loading from './Loading';
import Error from './Error';
import Spacer from './Spacer';
import Comments from './Comments';
import PostNew from './PostNew';
import Media from './Media';
import Avatar from './Avatar';
import ActionLink from './ActionLink';

const styles = StyleSheet.create({
  avatarIcon: {
    color: '#3b3b3b',
    margin: 10,
    fontSize: 60,
  },
  avatarThumbnail: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    left: 10,
    top: 0,
    zIndex: 2,
  },
  avatar: {
    position: 'absolute',
    left: 10,
    top: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    zIndex: 2,
    overflow: 'hidden',
    borderRadius: 80,
    width: 80,
    height: 80,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  pillWrapper: {
    position: 'absolute',
    top: 32,
    right: 5,
    borderRadius: 15,
    backgroundColor: Colors.brandPrimary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 2,
  },
  dateTime: {
    fontWeight: '100',
    fontSize: 10,
    color: '#fff',
  },
  userName: {
    position: 'relative',
    paddingLeft: 85,
    top: 0,
  },
  container: {
    position: 'relative',
    zIndex: 1,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0)',
    position: 'relative',
    paddingTop: 40,
    marginTop: -40,
    zIndex: 1,
    top: -3,
  },
  cardBody: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomColor: '#ededed',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  mediaWrapper: {
    position: 'relative',
    flex: 1,
    zIndex: 0,
  },
  media: {
    height: 250,
    width: null,
    flex: 1,
  },
});

const EventView = (props) => {
  const {
    locale,
    location,
    currentUser,
    upload,
    error,
    loading,
    member,
    event,
    eventId,
    addComment,
    addPost,
    likeFn,
    uploadFn,
    wpUsers,
    posts,
    notes,
    activeTab,
    navigation
  } = props;

  // Loading
  if (loading) return <Loading />;

  // Error
  if (error) return <Error content={error} />;

  // event not found
  if (!event || !event.id) return <Error content={ErrorMessages.event404} />;

  const hotPosts = activeTab == 'hotposts';

  const timeline = hotPosts ? notes : posts;

  const newComment = (post, content) => {
    addComment({
      user: currentUser,
      content,
      eventId,
      postId: post.id,
      postType: (hotPosts ? 'notes' : 'post'),
    });
  };

  const toggleLike = (post) => {
    likeFn({
      user: currentUser,
      eventId,
      postId: post.id,
      postType: (hotPosts ? 'notes' : 'post'),
    });
  };

  const newPost = (post) => {
    addPost({
      ...post,
      eventId,
      username: member.display_name,
    });
  };

  const dateFormatter = (datetime) => {
    if (!datetime) return '';
    moment.locale('pt-br');
    const formattedDate = moment(datetime).calendar();
    return formattedDate || '';
  };

  const keyExtractor = item => (item.id && item.id.toString()) || '';

  let loaded = 100;

  const loadMore = () => {
    loaded += 10;
  };

  return (
    <Container>
      <Content>
        <EventHeader event={event} />
        <View style={{ padding: 10 }}>
          <H3>{event.title}</H3>
          {!!event.organizers && event.organizers.length && <Text>{event.organizers.join(' & ')}</Text>}

          <Spacer size={10} />
          {!!event.description && <Text>{event.description}</Text>}

          {(!hotPosts && (
            <Card>
              <CardItem>
                <PostNew
                  upload={upload}
                  user={currentUser}
                  eventId={eventId}
                  onSubmit={newPost}
                  uploadFn={uploadFn}
                  {...props}
                />
              </CardItem>
            </Card>
          )) || null}

          <Spacer size={20} />
          {!!loading && <Spinner color={Colors.brandPrimary} />}

          {!!timeline && !!timeline.length && <FlatList
            numColumns={1}
            getItemLayout={(item, index) => {
              const hasMedia = item.media && item.media[0] && item.media[0].src;
              const itemHeight = hasMedia ? 600 : 300;
              return { length: itemHeight, offset: itemHeight * index, index };
            }}
            data={timeline.slice(0).reverse()}
            renderItem={({ item, index }) => {
              const hasMedia = item.media && item.media[0] && item.media[0].src;
              const containerStyle = hasMedia ?
                { ...styles.container, marginTop: 30, borderRadius: 0 } :
                { ...styles.container, marginTop: 30 };
              return (
              !!item.username && index < loaded &&
              <View style={containerStyle}>
                <View style={styles.mediaWrapper}>
                  <Media media={item.media} />
                </View>
                <Card transparent style={styles.card}>
                  <Avatar
                    style={styles.avatar}
                    iconStyle={styles.avatarIcon}
                    thumbStyle={styles.avatarThumbnail}
                    src={(wpUsers[Number(item.user)] && wpUsers[Number(item.user)].avatar) || ''}
                  />
                  <View style={styles.pillWrapper}>
                    <Text note style={styles.dateTime}>{dateFormatter(item.datetime)}</Text>
                  </View>
                  <CardItem>
                    <Body style={styles.userName}>
                      <Text style={{ fontWeight: 'bold' }}>{item.username}</Text>
                    </Body>
                  </CardItem>
                  <CardItem cardBody style={styles.cardBody}>
                    <Body>
                      <Spacer size={10} />
                      <Text>{item.content}</Text>
                      {/*
                      <WebView
                        style={{ flex: 1, padding: 5, color: '#3b3b3b', height: 50 }}
                        source={{ html: `<div>${item.content}</div>` }}
                      /> */}
                      <Spacer size={15} />
                      {hotPosts && <ActionLink post={item} />}
                    </Body>
                  </CardItem>
                  <Comments
                    wpUsers={wpUsers}
                    currentUser={currentUser}
                    post={item}
                    onSubmit={newComment}
                    onLike={toggleLike}
                    dateFormatter={dateFormatter}
                    {...props}
                  />
                </Card>
                <Spacer size={30} />
              </View>
            )}}
            keyExtractor={keyExtractor}
            onEndReached={loadMore}
            onEndReachedThreshold={1}
          /> }

          <Spacer size={20} />

        </View>

      </Content>
    </Container>
  );
};

EventView.propTypes = {
  upload: PropTypes.shape(),
  locale: PropTypes.string,
  location: PropTypes.shape(),
  activeTab: PropTypes.string,
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
  wpUsers: PropTypes.shape(),
  currentUser: PropTypes.number,
};

EventView.defaultProps = {
  currentUser: 0,
  locale: null,
  error: null,
  activeTab: 'liveposts',
  location: {},
  posts: [],
  notes: [],
  wpUsers: {},
  upload: {},
};

export default EventView;
