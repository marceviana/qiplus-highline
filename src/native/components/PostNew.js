import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/locale/pt-br';

import { Permissions, ImagePicker } from 'expo';
import { View } from 'react-native';
import { Text, Form, Button, Textarea } from 'native-base';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';

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
    upload: PropTypes.shape({
      uploading: PropTypes.bool,
      metadata: PropTypes.shape(),
      progress: PropTypes.number,
      error: PropTypes.string,
    }),
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
      localURI: '',
      hasFocus: false,
      showComments: false,
    },
    upload: {
      uploading: false,
      metadata: {},
      progress: 0,
      error: '',
    },
  }

  constructor(props) {
    super(props);
    this.state = props.initialState;

    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleFile = this.handleFile.bind(this);
    this._send = this._send.bind(this);
    this._pickImage = this._pickImage.bind(this);
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
  handleFile = (uri) => {
    const file = uri;
    const { user, eventId } = this.props;
    const path = 'events';

    this.props.uploadFn({
      eventId, path, file, user,
    });
  }

  _send = () => {
    const {
      onSubmit, post, user, upload,
    } = this.props;

    const { content } = this.state;
    const { metadata } = upload;

    if (!content && (!metadata || !metadata.downloadURL)) return;

    const type = (metadata && metadata.contentType) || '';
    const src = metadata.downloadURL || '';

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

  _pickImage = async () => {
    const res = await Promise.all([
      Permissions.askAsync(Permissions.CAMERA),
      Permissions.askAsync(Permissions.CAMERA_ROLL),
    ]);

    if (res.some(({ status }) => status === 'granted')) {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
      });

      const { cancelled, uri } = result;

      if (!cancelled) {
        this.setState({
          ...this.state,
          localURI: uri,
        });
        this.handleFile(uri);
      }
    }
  }

  render() {
    const {
      content, hasFocus, localURI,
    } = this.state;

    const {
      progress, upload,
    } = this.props;

    const { metadata } = upload;
    
    const rows = hasFocus || content ? 5 : 2;

    return (
      <Form style={{ flex: 1 }}>
        <Media style={{ flex: 1 }} media={[{ src: localURI, type: metadata.contentType }]} />
        <View style={{ flex: 1 }} className="upload-progress"><Text style={{ width: `${progress}%` }} >{' '}</Text></View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <Button block onPress={() => this._pickImage()} style={{ justifyContent: 'center', backgroundColor: '#ee1d67' }}>
              <SimpleLineIcon style={{ fontSize: 18, color: '#fff' }} name="picture" />
            </Button>
          </View>
          <View style={{ flex: 1 }}>
            <Button block style={{ justifyContent: 'center', backgroundColor: '#ee1d67' }}>
              <SimpleLineIcon style={{ fontSize: 18, color: '#fff' }} name="camera" />
            </Button>
          </View>
        </View>
        <View style={{ flex: 1, marginTop: 15 }}>
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
          <Button block style={{ flex: 1, justifyContent: 'center', backgroundColor: '#ee1d67' }} onPress={() => this._send()}>
            <SimpleLineIcon style={{ fontSize: 18, color: '#fff' }} name="paper-plane" />
          </Button>
        </View>
      </Form>
    );
  }
}

export default PostNew;
