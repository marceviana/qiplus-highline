import React from 'react';
import { Video } from 'expo';
import { Image, StyleSheet } from 'react-native';
import { Text } from 'native-base';

const styles = StyleSheet.create({
  media: {
    height: 250,
    width: null,
    flex: 1,
  },
});

const Media = ({ media }) => (
  (media && media[0] && media[0].src && (
    media[0].type && media[0].type.indexOf('vid') >= 0 ?
      <Video
        source={{ uri: media[0].src }}
        resizeMode="cover"
        style={styles.media}
        useNativeControls
      />
      :
      <Image
        source={{ uri: media[0].src }}
        style={styles.media}
      />
  )) || <Text>{' '}</Text>
);

export default Media;
