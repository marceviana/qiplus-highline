import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Container, Content, Text, Icon, Button } from 'native-base';
import Spacer from './Spacer';

const styles = StyleSheet.create({
  homeContainer: {
    backgroundColor: '#fff',
  },
  homeWrapper: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
});

const About = () => (
  <Container style={styles.homeContainer}>
    <Content>
      <Image source={{ uri: 'http://qiplus.com.br/wp-content/uploads/recorte2.jpg' }} style={{ height: 400, width: null, flex: 1 }} />
      <Spacer size={30} />
      <View style={styles.homeWrapper}>
        <Button onPress={() => Actions.events()} >
          <Icon name="calendar" /> <Text>Ver meus eventos no Live QI Plus</Text>
        </Button>
      </View>
    </Content>
  </Container>
);

export default About;
