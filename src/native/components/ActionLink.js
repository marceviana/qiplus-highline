import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import Timer from './Timer';

const ActionLink = ({ action_link, deadline }) => (
  action_link &&
    (!deadline || new Date(deadline).getTime() < new Date().getTime()) && (
      <View style={{ fontSize: 13 }}>
        <Timer href={action_link} deadline={deadline} />
      </View>
  )) || null;

ActionLink.propTypes = {
  action_link: PropTypes.string,
  deadline: PropTypes.string,
};

ActionLink.defaultProps = {
  action_link: '',
  deadline: '',
};

export default ActionLink;
