import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';

import { Footer, FooterTab, Text, Button, Icon } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Colors from '../../../native-base-theme/variables/commonColor';

const styles = StyleSheet.create({
  footerTab: {
    backgroundColor: Colors.brandPrimary,
  },
  footerBtn: {
    backgroundColor: Colors.brandPrimary,
  },
  footerText: {
    color: '#fff',
  },
  footerIcon: {
    color: '#fff',
  },
});

const EventFooter = ({ eventId, activeTab }) => {
  const livePosts = activeTab == 'liveposts';
  const hotPosts = activeTab == 'hotposts';
  const isParticipants = activeTab == 'participants';

  return (
    <Footer>
      <FooterTab style={styles.footerTab}>
        <Button
          style={livePosts ?
                    { ...styles.footerBtn, backgroundColor: Colors.tabActiveBgColor } :
                    { ...styles.footerBtn }}
          onPress={() => Actions.liveposts({
                    location: { pathname: `/event/${eventId}/notes` },
                    match: { params: { id: Number(eventId), tab: 'liveposts' } },
                })}
          vertical
          active={livePosts}
        >
          <Icon style={styles.footerIcon} name="apps" />
          <Text style={styles.footerText}>Live Posts</Text>
        </Button>
        <Button
          style={hotPosts ?
                    { ...styles.footerBtn, backgroundColor: Colors.tabActiveBgColor } :
                    { ...styles.footerBtn }}
          onPress={() => Actions.hotposts({
                    location: { pathname: `/event/${eventId}/notes` },
                    match: { params: { id: Number(eventId), tab: 'hotposts', url: 'notes' } },
                })}
          vertical
          active={hotPosts}
        >
          <Icon style={styles.footerIcon} name="flame" />
          <Text style={styles.footerText}>Hot Posts</Text>
        </Button>
        <Button
          style={isParticipants ?
                    { ...styles.footerBtn, backgroundColor: Colors.tabActiveBgColor } :
                    { ...styles.footerBtn }}
          onPress={() => Actions.participants({
                    location: { pathname: `/event/${eventId}/participants` },
                    match: { params: { id: Number(eventId), tab: 'participants', url: 'participants' } },
                })}
          vertical
          active={isParticipants}
        >
          <Icon style={styles.footerIcon} name="contacts" />
          <Text style={styles.footerText}>Participantes</Text>
        </Button>
      </FooterTab>
    </Footer>
  );
};

EventFooter.propTypes = {
  eventId: PropTypes.number.isRequired,
  activeTab: PropTypes.string.isRequired,
};

export default EventFooter;
