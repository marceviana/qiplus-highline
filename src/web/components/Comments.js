
import React from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  CardFooter,
  CardTitle,
  CardText,
  Button,
  Badge,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  Input,
} from 'reactstrap';
import { translate } from '../../i18n';

const styles = {
  cardBody: {
    position: 'relative',
    fontSize: 12,
  },
  dateTime: {
    position: 'absolute',
    top: 5,
    right: 5,
    fontWeight: 100,
    borderRadius: 5,
  },
  label: {
    position: 'relative',
    marginRight: 15,
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -8,
    height: 20,
    width: 20,
    lineHeight: 1.5,
    textAlign: 'center',
    padding: 3,
    fontSize: 11,
  },
  button: {
    borderRadius: '50%',
    border: '1px solid',
  },
  avatar: {
    borderRadius: 60,
    width: 60,
    height: 60,
    textAlign: 'center',
    overflow: 'hidden',
    boxShadow: '0 0 2px #999',
  },
};

const Avatar = (props) => {
  const { user, wpUsers } = props;
  if (!wpUsers || !wpUsers[user] || !wpUsers[user].avatar) return <div className="avatar-icon"><i className="icon-user" style={{ fontSize: 40 }} /></div>;
  return (
    <div className="avatar-img">
      {
        !!wpUsers[user] && wpUsers[user].avatar &&
        <img alt="" src={wpUsers[user].avatar} />
      }
    </div>
  );
};

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

  handleChange = (event) => {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value,
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
      <div>
        <CardFooter>
          <Row>
            <Col xs="12">
              <label htmlFor="button" style={styles.label}>
                <Button className={post.likes && post.likes.indexOf(currentUser) >= 0 ? 'bg-qi' : ''} onClick={() => this.toggleLike()} style={styles.button}><i className="icon-like" /></Button>
                {post.likes && post.likes.length &&
                  <Badge style={styles.badge} pill>{post.likes.length}</Badge>
                }
              </label>
              <label htmlFor="button" style={styles.label}>
                <Button className="bg-qi" onClick={() => this.handleOpen(!isOpen)} active={!!isOpen} style={styles.button}><i className="icon-bubbles" /></Button>
                {post.comments && post.comments.length &&
                  <Badge style={styles.badge} pill>{post.comments.length}</Badge>
                }
              </label>
            </Col>
          </Row>
        </CardFooter>

        { !!post.comments && !!post.comments.length && post.comments.map((comment, index) => {
        const { user } = comment;
        const i = index + 1;
        if ( !!isOpen && index < loaded) {
          return (
            <CardFooter key={i}>
              <div className="comment-wrapper">
                <Avatar user={user} wpUsers={this.props.wpUsers} />
                <CardTitle style={{ fontSize: 13 }}>
                  {!!wpUsers[user] && wpUsers[user].display_name}
                </CardTitle>
                <CardText style={{ fontSize: 12 }}>{comment.content}</CardText>
              </div>
            </CardFooter>
          )
        }
        return null;
        })
        } 

        { !!isOpen && !!post.comments && post.comments.length > loaded &&
        <Button
          block
          size="sm"
          style={{ borderRadius: 0 }}
          onClick={() => this.handleComments(loaded + 5)}
          color="default"
        >
          {translate('load_more')}
        </Button>
        }
        { !!isOpen && !!post.comments && post.comments.length > loaded &&
          post.comments[post.comments.length - 1].user === currentUser && 
          <CardFooter>
            <div className="comment-wrapper">
              <Avatar user={currentUser} wpUsers={this.props.wpUsers} />
              <CardTitle style={{ fontSize: 13 }}>
                {!!wpUsers[currentUser] && wpUsers[currentUser].display_name}
              </CardTitle>
              <CardText style={{ fontSize: 12 }}>
                {post.comments[post.comments.length - 1].content}
              </CardText>
            </div>
          </CardFooter>
        }

        { !!isOpen &&
        <CardFooter style={{ fontSize: 13 }}>
          <FormGroup row>
            <Col sm={12}>
              <InputGroup size="sm" style={{ marginTop: 15 }}>
                <Input
                  onKeyPress={e => e.which === 13 && this.send()}
                  type="textarea"
                  name="content"
                  id={commentId}
                  rows={hasFocus || content ? 4 : 1}
                  placeholder={translate('comment_action')}
                  value={content}
                  onChange={this.handleChange}
                  onFocus={this.handleFocus}
                  onBlur={this.handleFocus}
                />
                <InputGroupAddon addonType="append">
                  <Button className={hasFocus || content ? 'bg-qi' : ''} color="default" onClick={() => this.send()}>
                    <i className="icon-paper-plane" />
                  </Button>
                </InputGroupAddon>
              </InputGroup>
            </Col>
          </FormGroup>
        </CardFooter>
        }
      </div>
    );
  }
}

export default Comments;
