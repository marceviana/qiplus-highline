import React from 'react';
import PropTypes from 'prop-types';
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

const About = ({ member, logout }) => (
  <Container style={styles.homeContainer}>
    <Content>
      <Image
        source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/br-com-qiplus.appspot.com/o/live%2Fbanner-home.jpg?alt=media&token=c02f49be-dc94-4d44-a198-aa31ba21bc15' }}
        style={{ height: 400, width: null, flex: 1 }}
      />
      <Spacer size={30} />
      {(member && member.email) ?
        (<View style={styles.homeWrapper}>
          <Button onPress={() => Actions.events()} >
            <Icon name="calendar" />
            <Text>Ver meus eventos no Live QI Plus</Text>
          </Button>
          <Button onPress={() => logout()} >
            <Icon name="calendar" />
            <Text>Logout</Text>
          </Button>
        </View>)
        :
        (<View style={styles.homeWrapper}>
          <Button onPress={() => Actions.login()} >
            <Icon name="calendar" />
            <Text>Fazer login no Live QI Plus</Text>
          </Button>
          <Button onPress={() => Actions.signUp()} >
            <Icon name="calendar" />
            <Text>Criar uma conta no Live QI Plus</Text>
          </Button>
        </View>)
      }
    </Content>
  </Container>
);

About.propTypes = {
  member: PropTypes.shape({}),
  logout: PropTypes.func.isRequired,
};

About.defaultProps = {
  member: {},
};

export default About;
