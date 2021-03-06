import React from 'react';
import PropTypes from 'prop-types';

import { StyleSheet, View } from 'react-native';
import { Text, Form, Item, CardItem, Button, Body, Textarea, Thumbnail, Badge, Left, Icon } from 'native-base';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import { translate } from '../../i18n';

const styles = StyleSheet.create({
  iconButton: {
    borderRadius: 50,
    width: 50,
    height: 50,
    overflow: 'hidden',
    justifyContent: 'center',
  },
});

const Avatar = ({ user, wpUsers, style }) => {
  if (!wpUsers[user] || !wpUsers[user].avatar) return <Left style={style}><FontAwesomeIcon size={50} name="user-circle-o" /></Left>;
  return (
    <Left style={style}>
      {
        !!wpUsers[user] && wpUsers[user].avatar &&
        <Thumbnail source={{ uri: wpUsers[user].avatar }} />
      }
    </Left>
  );
};

const Counter = ({ count }) => {
  if (!Array.isArray(count) || !count.length) return null;
  return (
    <Badge primary>
      <Text>{count.length.toString()}</Text>
    </Badge>
  )
}

class Comments extends React.Component {
  static propTypes = {
    commentId: PropTypes.string.isRequired,
    post: PropTypes.shape({}).isRequired,
    wpUsers: PropTypes.shape(),
    onSubmit: PropTypes.func.isRequired,
    onLike: PropTypes.func.isRequired,
    currentUser: PropTypes.number.isRequired,
  }

  static defaultProps = {
    wpUsers: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      content: '',
      isOpen: false,
      hasFocus: false,
      showComments: false,
      loaded: 5,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleComments = this.handleComments.bind(this);
  }

  handleChange = (name, val) => {
    this.setState({
      ...this.state,
      [name]: val,
    });
  }
  handleFocus = () => {
    this.setState({
      ...this.state,
      hasFocus: !this.state.hasFocus,
    });
  }
  handleOpen = (val) => {
    this.setState({
      ...this.state,
      isOpen: !!val,
    });
  }
  handleComments = (val) => {
    this.setState({
      ...this.state,
      loaded: val,
    });
  }
  toggleLike = () => {
    const { onLike, post } = this.props;
    onLike(post);
  }

  send = () => {
    const { onSubmit, post } = this.props;
    const { content } = this.state;

    if (!content) return;

    onSubmit(post, content);

    this.setState({
      ...this.state,
      content: '',
    });
  }

  render() {
    const {
      commentId, post, wpUsers, currentUser,
    } = this.props;

    const {
      content, loaded, hasFocus, isOpen,
    } = this.state;

    return (
      <View>
        <CardItem>
          <Button
            transparent
            onPress={() => this.toggleLike()}
            style={styles.iconButton}
          >
            <SimpleLineIcon size={20} name="like" style={{ color: (post.likes && post.likes.indexOf(currentUser) >= 0 ? '#ee1d67' : '') }} />
          </Button>
          <Counter primary count={post.likes} />
          <Button
            transparent
            onPress={() => this.handleOpen(!isOpen)}
            active={!!isOpen}
            style={styles.iconButton}
          >
            <FontAwesomeIcon size={20} name="comment-o" />
          </Button>
          <Counter primary count={post.comments} />
        </CardItem>

        {(!!post.comments && !!post.comments.length && post.comments.map((comment, index) => {
          const { user } = comment;
          const i = index + 1;

          if (!!isOpen && index < loaded) {
              return (
                <CardItem key={i}>
                  <Avatar style={{ flex: 0.25 }} user={user} wpUsers={wpUsers} />
                  <Body style={{ flex: 0.75 }}>
                    <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                      {(!!wpUsers[user] && wpUsers[user].display_name) || ''}
                    </Text>
                    <Text style={{ fontSize: 13 }}>{comment.content || ''}</Text>
                  </Body>
                </CardItem>
              );
            }
            return null;
          }) ) || null
        }

        {(!!isOpen && !!post.comments && post.comments.length > loaded && (
          <CardItem>
            <Button
              style={{ borderRadius: 0, flex: 1 }}
              onPress={() => this.handleComments(loaded + 5)}
            >
              <Text>{translate('load_more')}</Text>
            </Button>
          </CardItem>
        ) ) || null 
        }

        {/* <Comment item={post.comments}> */}
        {(!!isOpen && !!post.comments && post.comments.length > loaded &&
          post.comments[post.comments.length - 1].user === currentUser &&
          <CardItem>
            <Avatar style={{ flex: 0.25 }} user={currentUser} wpUsers={wpUsers} />
            <Body style={{ flex: 0.75 }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                {(!!wpUsers[currentUser] && wpUsers[currentUser].display_name) || ''}
              </Text>
              <Text style={{ fontSize: 13 }}>{post.comments[post.comments.length - 1].content || ''}</Text>
            </Body>
          </CardItem>) || null
        }

        {(!!isOpen &&
        <CardItem style={{ marginTop: 5 }}>
          <Form style={{ alignSelf: 'stretch', flex: 1 }}>
            <View style={{ flex: 0.75 }}>
              <Textarea
                type="textarea"
                name="content"
                id={commentId}
                rowSpan={hasFocus || content ? 4 : 2}
                placeholder={translate('comment_action')}
                value={content}
                onChangeText={v => this.handleChange('content', v)}
                onFocus={() => this.handleFocus(true)}
                onBlur={() => this.handleFocus(false)}
                style={{ flex: 1, borderRadius: 3 }}
                bordered
              />
            </View>
            <View style={{ flex: 0.25, marginTop: 5 }}>
              <Button onPress={() => this.send()}>
                <Icon name="paper-plane" />
              </Button>
            </View>
          </Form>
        </CardItem>) || null
        }

      </View>
    );
  }
}

export default Comments;
