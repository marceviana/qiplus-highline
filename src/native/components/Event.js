import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/locale/pt-br';

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import { Actions } from 'react-native-router-flux';
import { Video } from 'expo';
import { FlatList, RefreshControl, WebView, Image, StyleSheet, View } from 'react-native';
import { Container, Content, Footer, FooterTab, Card, CardItem, Body, H3, Text, Button, Icon, Spinner, Thumbnail } from 'native-base';
import Colors from '../../../native-base-theme/variables/commonColor';
import ErrorMessages from '../../constants/errors';
import Loading from './Loading';
import Error from './Error';
import Spacer from './Spacer';
import Comments from './Comments';
import PostNew from './PostNew';
import Timer from './Timer';

const styles = StyleSheet.create({
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
  avatarIcon: {
    color: '#3b3b3b',
    margin: 10,
  },
  avatarThumbnail: {
    position: 'absolute',
    left: 10,
    top: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    zIndex: 2,
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
  footerTab: {
    backgroundColor: Colors.brandPrimary,
  },
  footerBtn: {
    backgroundColor: Colors.brandPrimary,
  },
  footerText: {
    color: '#fff',
  },
  footerIcon: {
    color: '#fff',
  },
});

export const Media = ({ media }) => (
  (media && media[0] && media[0].src && (
    media[0].type && media[0].type.indexOf('vid') >= 0 ?
      <Video
        source={{ uri: media[0].src }}
        shouldPlay
        resizeMode="cover"
        style={styles.media}
      />
      :
      <Image
        source={{ uri: media[0].src }}
        style={styles.media}
      />
  )) || <Text>{' '}</Text>
);

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
  } = props;

  // Loading
  if (loading) return <Loading />;

  // Error
  if (error) return <Error content={error} />;

  // event not found
  if (!event || !event.id) return <Error content={ErrorMessages.event404} />;

  const isPitch = location.pathname && location.pathname.indexOf('notes') >= 0;

  const timeline = isPitch ? notes : posts;

  const Avatar = ({ user, style }) => {
    if (!wpUsers[user] || !wpUsers[user].avatar) return <View style={style}><FontAwesomeIcon style={styles.avatarIcon} size={60} name="user-circle-o" /></View>;
    return (
      <Thumbnail large style={styles.avatarThumbnail} source={{ uri: wpUsers[user].avatar }} />
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
      <View style={{ fontSize: 13 }}>
        <Timer href={action_link} deadline={deadline} />
      </View>
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

  return (
    <Container>
      <Content padder>
        <Image source={{ uri: event.banner }} style={{ height: 200, width: null, flex: 1 }} />

        <Spacer size={25} />
        <H3>{event.title}</H3>
        {!!event.organizers && event.organizers.length && <Text>{event.organizers.join(' & ')}</Text>}

        <Spacer size={10} />
        {!!event.description && <Text>{event.description}</Text>}

        {(!isPitch && (
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
          data={timeline.slice(0).reverse()}
          renderItem={({ item, index }) => {
            const hasMedia = item.media && item.media[0] && item.media[0].src;
            const containerStyle = hasMedia ?
              { ...styles.container, borderRadius: 0 } :
              styles.container;
            return (
            !!item.username && index < loaded &&
            <View style={containerStyle}>
              <View style={styles.mediaWrapper}>
                <Media media={item.media} />
              </View>
              <Card transparent style={styles.card}>
                <Avatar style={styles.avatar} user={Number(item.user)} />
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
                    <WebView source={{ html: item.content }} />
                    <Spacer size={15} />
                    <ActionLink post={item} />
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
              <Spacer size={60} />
            </View>
          )}}
          keyExtractor={keyExtractor}
          onEndReached={loadMore}
          onEndReachedThreshold={1}
        /> }

        <Spacer size={20} />

      </Content>

      <Footer>
        <FooterTab style={styles.footerTab}>
          <Button
            style={!isPitch ? {...styles.footerBtn, backgroundColor: Colors.tabActiveBgColor } : {...styles.footerBtn }}
            onPress={() => Actions.event({ location: { pathname: `/event/${eventId}/notes` }, match: { params: { id: String(eventId) } } })}
            vertical
            active={!isPitch}
          >
            <Icon style={styles.footerIcon} name="apps" />
            <Text style={styles.footerText}>Live Posts</Text>
          </Button>
          <Button
            style={isPitch ? {...styles.footerBtn, backgroundColor: Colors.tabActiveBgColor } : {...styles.footerBtn }}
            onPress={() => Actions.event({ location: { pathname: `/event/${eventId}/notes` }, match: { params: { id: String(eventId), url: 'notes' } } })}
            vertical
            active={isPitch}
          >
            <Icon style={styles.footerIcon} name="flame" />
            <Text style={styles.footerText}>Hot Posts</Text>
          </Button>
          <Button
            style={false ? {...styles.footerBtn, backgroundColor: Colors.tabActiveBgColor } : {...styles.footerBtn }}
            onPress={() => Actions.event({ location: { pathname: `/event/${eventId}/notes` }, match: { params: { id: String(eventId) } } })}
            vertical
            active={false}
          >
            <Icon style={styles.footerIcon} name="contacts" />
            <Text style={styles.footerText}>Participantes</Text>
          </Button>
        </FooterTab>
      </Footer>
    </Container>
  );
};

EventView.propTypes = {
  upload: PropTypes.shape(),
  locale: PropTypes.string,
  location: PropTypes.shape(),
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
  location: {},
  posts: [],
  notes: [],
  wpUsers: {},
  upload: {},
};

export default EventView;
