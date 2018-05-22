import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/locale/pt-br';

import { StyleSheet, View } from 'react-native';
import { Text, Form, Item, CardItem, Button, Body, Textarea, Image, Left, Input, Icon } from 'native-base';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Media } from './Event';

import { translate } from '../../i18n';

class PostNew extends React.Component {
  static propTypes = {
    initialState: PropTypes.shape(),
    post: PropTypes.shape({
      comments: PropTypes.arrayOf(PropTypes.shape()),
      content: PropTypes.string,
      datetime: PropTypes.string,
      id: PropTypes.number,
      media: PropTypes.arrayOf(PropTypes.shape()),
      status: PropTypes.number,
      user: PropTypes.number,
      username: PropTypes.string,
    }),
    onSubmit: PropTypes.func.isRequired,
    uploadFn: PropTypes.func.isRequired,
    user: PropTypes.number.isRequired,
    eventId: PropTypes.number.isRequired,
  }

  static defaultProps = {
    post: {
      comments: [],
      content: '',
      datetime: '',
      id: 0,
      media: [],
      status: 1,
      user: 0,
      username: '',
    },
    initialState: {
      content: '',
      downloadURL: '',
      metadata: {},
      hasFocus: false,
      showComments: false,
      progress: 0,
    },
  }

  constructor(props) {
    super(props);
    this.state = props.initialState;

    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleFile = this.handleFile.bind(this);
  }

  handleChange = (name, val) => {
    this.setState({
      ...this.state,
      [name]: val,
    });
  }
  handleFocus = (val) => {
    this.setState({
      ...this.state,
      hasFocus: !!val,
    });
  }
  handleFile = (e) => {
    // const file = e.target.files[0];
    // const { user, eventId } = this.props;
    // const path = 'events';

    // this.props.uploadFn({
    //   eventId, path, file, user,
    // }, (result) => {
    //   if (result.progress) {
    //     this.setState({
    //       ...this.state,
    //       progress: result.progress,
    //     });
    //     return;
    //   }

    //   if (result.downloadURL) {
    //     const { metadata, downloadURL } = result;
    //     this.setState({
    //       ...this.state,
    //       progress: 0,
    //       downloadURL,
    //       metadata,
    //     });
    //     return;
    //   }

    //   if (result.error) {
    //     this.setState({
    //       ...this.state,
    //       progress: 0,
    //       downloadURL: '',
    //       metadata: {},
    //     });
    //   }
    // });
  }

  send = () => {
    const { onSubmit, post, user } = this.props;
    const { content, downloadURL, metadata } = this.state;

    if (!content && !downloadURL) return;

    const type = (metadata && metadata.contentType) || '';
    const src = downloadURL || '';

    onSubmit({
      ...post,
      content,
      user,
      datetime: moment().format('YYYY-MM-DD hh:mm:ss'),
      media: [{ type, src }],
    });

    setTimeout(() => {
      this.setState(this.props.initialState);
    }, 100);
  }

  render() {
    const {
      content, hasFocus, downloadURL, progress, metadata,
    } = this.state;

    const rows = hasFocus || content ? 4 : 1;

    return (
      <Form style={{ marginTop: 15 }}>
        <Media media={[{ src: downloadURL, type: metadata.contentType }]} />
        <View className="upload-progress"><Text style={{ width: `${progress}%` }} >{' '}</Text></View>
        <View style={{ flex: 1 }}>
          <Button style={{ flex: 1, backgroundColor: (hasFocus || content ? '#ee1d67' : '#b5b5b5') }}>
            <SimpleLineIcon style={{ color: '#fff' }} name="picture" />            
          </Button>
          <Button style={{ flex: 1, backgroundColor: (hasFocus || content ? '#ee1d67' : '#b5b5b5') }}>
            <SimpleLineIcon style={{ color: '#fff' }} name="camera" />            
          </Button>
        </View>
        <CardItem>
          <View>
            <View style={{ marginTop: 15 }}>
              <Textarea
                type="textarea"
                name="content"
                rowSpan={rows}
                placeholder={translate('post_placeholder')}
                value={content}
                onChangeText={v => this.handleChange('content', v)}
                onFocus={() => this.handleFocus(true)}
                onBlur={() => this.handleFocus(false)}
                style={{ flex: 1, borderRadius: 3 }}
                bordered
              />
              <Button className={hasFocus || content ? 'bg-qi' : ''} onPress={() => this.send()}>
                <SimpleLineIcon name="paper-plane" />
              </Button>
            </View>
          </View>
        </CardItem>
      </Form>
    );
  }
}

export default PostNew;
