
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  Row,
  Col,
  Button,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  Input,
} from 'reactstrap';
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
  }

  handleChange = (event) => {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value,
    });
  }
  handleFocus = (val) => {
    this.setState({
      ...this.state,
      hasFocus: !!val,
    });
  }
  handleFile = (e) => {
    const file = e.target.files[0];
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

  render() {
    const {
      content, hasFocus,
    } = this.state;

    const {
      upload,
    } = this.props;

    const { metadata, progress } = upload;
    const downloadURL = (metadata && metadata.downloadURL) || '';

    const rows = hasFocus || content ? 4 : 1;

    return (
      <FormGroup style={{ marginTop: 15 }}>
        {
          !!downloadURL && (
            metadata.contentType && metadata.contentType.indexOf('vid') >= 0 ?
              <div className="post-video"><video width="100%" controls><track kind="captions" /><source src={downloadURL} type={metadata.contentType} /></video></div>
            :
              <div className="post-img"><img src={downloadURL} alt="My upload" /></div>
          )
        }
        {
          !!progress && Number(progress) < 100 && <div className="upload-progress"><span style={{ width: `${progress}%` }} /></div>
        }
        <div className="column-2">
          <div className={`fileinput-button btn-wrapper btn-col-2 ${hasFocus || content ? 'bg-qi' : ''}`} color="default">
            <i className="icon-picture" />
            <Input
              type="file"
              name="file"
              onChange={this.handleFile}
            />
            <span>{translate('pick_file')}</span>
          </div>
          <div className={`btn-wrapper btn-col-2 ${hasFocus || content ? 'bg-qi' : ''}`} color="default">
            <i className="icon-camera" />
            <span>{translate('start_camera')}</span>
          </div>
        </div>
        <Row>
          <Col sm={12}>
            <InputGroup size="sm" style={{ marginTop: 15 }}>
              <Input
                onKeyPress={e => e.which === 13 && this._send()}
                type="textarea"
                name="content"
                placeholder={translate('post_placeholder')}
                value={content}
                rows={rows}
                onChange={this.handleChange}
                onFocus={() => this.handleFocus(true)}
                onBlur={() => this.handleFocus(false)}
              />
              <InputGroupAddon addonType="append">
                <Button size="sm" className={hasFocus || content ? 'bg-qi' : ''} color="default" onClick={() => this._send()}>
                  <i className="icon-paper-plane" />
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </Col>
        </Row>
      </FormGroup>
    );
  }
}

export default PostNew;
