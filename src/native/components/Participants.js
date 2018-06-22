import React from 'react';
import PropTypes from 'prop-types';

import { StyleSheet, View } from 'react-native';
import { Container, Content, Body, H3, Text, Spinner, List, ListItem, Left, Right } from 'native-base';

import Colors from '../../../native-base-theme/variables/commonColor';
import ErrorMessages from '../../constants/errors';

import EventHeader from './EventHeader';
import EventFooter from './EventFooter';
import Loading from './Loading';
import Error from './Error';
import Spacer from './Spacer';
import Avatar from './Avatar';

const styles = StyleSheet.create({
  avatarIcon: {
    color: '#3b3b3b',
    fontSize: 40,
    width: 40,    
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
});

const ParticipantsListing = (props) => {
  const {
    location,
    currentUser,
    error,
    loading,
    member,
    event,
    eventId,
    activeTab,
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
      <Content>
        <EventHeader event={event} />
        <View style={{ padding: 10 }}>
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
                  <Avatar style={{ width: 50 }} iconStyle={styles.avatarIcon} src={(wpUsers[Number(user.user)] && wpUsers[Number(user.user)].avatar) || ''} />
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

        </View>
        
      </Content>

      <EventFooter eventId={eventId} activeTab={activeTab} />

    </Container>
  );
};

ParticipantsListing.propTypes = {
  location: PropTypes.shape(),
  error: PropTypes.string,
  activeTab: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  eventId: PropTypes.number.isRequired,
  event: PropTypes.shape().isRequired,
  member: PropTypes.shape().isRequired,
  wpUsers: PropTypes.shape(),
  currentUser: PropTypes.number,
};

ParticipantsListing.defaultProps = {
  currentUser: 0,
  error: null,
  activeTab: 'participants',
  location: {},
  wpUsers: {},
};

export default ParticipantsListing;
