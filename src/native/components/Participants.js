import React from 'react';
import PropTypes from 'prop-types';

import { StyleSheet } from 'react-native';
import { Container, Content, Body, H3, Text, Spinner, List, ListItem, Left, Right } from 'native-base';

import Colors from '../../../native-base-theme/variables/commonColor';
import ErrorMessages from '../../constants/errors';

import EventFooter from './EventFooter';
import Loading from './Loading';
import Error from './Error';
import Spacer from './Spacer';
import Banner from './Banner';
import Avatar from './Avatar';

const styles = StyleSheet.create({
  banner: {
    height: 300,
    width: null,
    flex: 1,
  },
  avatarIcon: {
    color: '#3b3b3b',
    fontSize: 20,
  },
  pillWrapper: {
    position: 'absolute',
    top: 32,
    right: 5,
    borderRadius: 15,
    backgroundColor: Colors.brandPrimary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 2,
  },
  dateTime: {
    fontWeight: '100',
    fontSize: 10,
    color: '#fff',
  },
  userName: {
    position: 'relative',
    paddingLeft: 85,
    top: 0,
  },
  container: {
    marginTop: 15,
    position: 'relative',
    zIndex: 1,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0)',
    position: 'relative',
    paddingTop: 40,
    marginTop: -40,
    zIndex: 1,
    top: -3,
  },
  cardBody: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomColor: '#ededed',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  mediaWrapper: {
    position: 'relative',
    flex: 1,
    zIndex: 0,
  },
  media: {
    height: 250,
    width: null,
    flex: 1,
  },
});

const EventView = (props) => {
  const {
    location,
    currentUser,
    error,
    loading,
    member,
    event,
    eventId,
    wpUsers,
  } = props;

  // Loading
  if (loading) return <Loading />;

  // Error
  if (error) return <Error content={error} />;

  // event not found
  if (!event || !event.id) return <Error content={ErrorMessages.event404} />;

  const participants = Object.keys(wpUsers).map(id => ({
    id: wpUsers[id].dbid,
    ...wpUsers[id],
  }));

  return (
    <Container>
      <Content padder>
        <Banner
          src={event.banner}
          style={styles.banner}
        />
        <Spacer size={25} />
        <H3>{event.title}</H3>
        {!!event.organizers && event.organizers.length && <Text>{event.organizers.join(' & ')}</Text>}

        <Spacer size={10} />
        {!!event.description && <Text>{event.description}</Text>}

        <Spacer size={20} />
        {!!loading && <Spinner color={Colors.brandPrimary} />}

        <List>
          { participants.map(user => (
            <ListItem avatar key={`${user.ID}`}>
              <Left>
                <Avatar iconStyle={styles.avatarIcon} src={(wpUsers[Number(user.user)] && wpUsers[Number(user.user)].avatar) || ''} />
              </Left>
              <Body>
                <Text>{user.first_name}</Text>
                <Text note>{user.first_name}</Text>
              </Body>
              <Right>
                <Text note>3:43 pm</Text>
              </Right>
            </ListItem>
          )) }
        </List>

        <Spacer size={20} />

      </Content>

      <EventFooter eventId={eventId} location={location} />

    </Container>
  );
};

EventView.propTypes = {
  location: PropTypes.shape(),
  error: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  eventId: PropTypes.number.isRequired,
  event: PropTypes.shape().isRequired,
  member: PropTypes.shape().isRequired,
  wpUsers: PropTypes.shape(),
  currentUser: PropTypes.number,
};

EventView.defaultProps = {
  currentUser: 0,
  error: null,
  location: {},
  wpUsers: {},
};

export default EventView;
