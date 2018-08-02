import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Container, Content, Text, Icon, Button } from 'native-base';
import Spacer from './Spacer';
import {withNavigation} from "react-navigation";

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

const About = (props) => (
  <Container style={styles.homeContainer}>
    <Content>
      <Image
        source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/br-com-qiplus.appspot.com/o/live%2Fbanner-home.jpg?alt=media&token=c02f49be-dc94-4d44-a198-aa31ba21bc15' }}
        style={{ height: 400, width: null, flex: 1 }}
      />
      <Spacer size={30} />
      <View style={styles.homeWrapper}>
        <Button onPress={() => props.navigation.navigate('Events')} >
          <Icon name="calendar" />
          <View><Text>Ver meus eventos no Live QI Plus</Text></View>
        </Button>
      </View>
    </Content>
  </Container>
);

export default withNavigation(About);
