import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

import Banner from './Banner';

const styles = StyleSheet.create({
  footerIcon: {
    color: '#fff',
  },
  banner: {
    height: 150,
    width: null,
    flex: 1,
  },
});

const EventHeader = ({ event }) => (
  <View style={{ height: 150, shadowColor: '#333333', shadowOffset: { width: 2, height: 2 } }}>
    <Banner
      src={event.banner}
      style={styles.banner}
    />
  </View>
);

EventHeader.propTypes = {
  event: PropTypes.shape().isRequired,
};

export default EventHeader;
