import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { logout, getMemberData } from '../actions/member';

class Home extends Component {
  static propTypes = {
    locale: PropTypes.string,
    Layout: PropTypes.func.isRequired,
    memberLogout: PropTypes.func.isRequired,
    getMemberData: PropTypes.func.isRequired,
    member: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      error: PropTypes.string,
    }).isRequired,
  }

  static defaultProps = {
    locale: null,
  }
  componentDidMount = () => this.props.getMemberData();

  render = () => {
    const {
      Layout, member, locale, memberLogout,
    } = this.props;

    return <Layout member={member} locale={locale} logout={memberLogout} />;
  }
}

const mapStateToProps = state => ({
  locale: state.locale || null,
  member: state.member || {},
});

const mapDispatchToProps = {
  memberLogout: logout,
  getMemberData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
