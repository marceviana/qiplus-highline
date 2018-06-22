import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { Thumbnail, Icon } from 'native-base';

const styles = StyleSheet.create({
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
});

const Avatar = ({ src, style, iconStyle }) => {
  if (!src) return <View style={style}><Icon type="FontAwesome" name="user-circle-o" style={iconStyle} /></View>;
  return (
    <Thumbnail large style={styles.avatarThumbnail} source={{ uri: src }} />
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  style: PropTypes.any,
  iconStyle: PropTypes.any,
};

Avatar.defaultProps = {
  src: '',
  style: {},
  iconStyle: {},
};

export default Avatar;