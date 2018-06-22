import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text, H1 } from 'native-base';
import Spacer from './Spacer';
import Colors from '../../../native-base-theme/variables/commonColor';

const Header = ({ title, content }) => (
  <View>
    <Spacer size={25} />
    <H1 style={{ color: Colors.brandPrimary }}>{title}</H1>
    {(!!content && (
      <View>
        <Spacer size={10} />
        <Text>{content}</Text>
      </View>
     )) || null
    }
    <Spacer size={25} />
  </View>
);

Header.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
};

Header.defaultProps = {
  title: 'Live QI Plus',
  content: '',
};

export default Header;
