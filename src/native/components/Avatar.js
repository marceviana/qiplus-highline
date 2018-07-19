import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Thumbnail, Icon } from 'native-base';

const Avatar = ({ src, style, iconStyle, thumbStyle }) => {
  if (!src) return <View style={style}><Icon type="FontAwesome" name="user-circle-o" style={iconStyle} /></View>;
  return (
    <Thumbnail style={thumbStyle} source={{ uri: src }} />
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  style: PropTypes.any,
  iconStyle: PropTypes.any,
  thumbStyle: PropTypes.any,
};

Avatar.defaultProps = {
  src: '',
  style: {},
  iconStyle: {},
  thumbStyle: {},
};

export default Avatar;