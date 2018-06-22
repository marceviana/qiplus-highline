import React from 'react';
import PropTypes from 'prop-types';
import { View, Image } from 'react-native';

const Banner = ({ src, style }) => {
  if (!src) return null;
  return (
    <View style={style}>
      <Image source={{ uri: src }} style={style} />
    </View>
  );
};

Banner.propTypes = {
  src: PropTypes.string,
  style: PropTypes.any,
};

Banner.defaultProps = {
  src: '',
  style: {},
};

export default Banner;
