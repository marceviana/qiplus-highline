import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { resetPassword } from '../actions/member';

const ForgotPassword = ({
  Layout,
  onFormSubmit,
  member,
  locale,
  isLoading,
  errorMessage,
}) => (
  <Layout
    member={member}
    loading={isLoading}
    error={errorMessage}
    locale={locale}
    onFormSubmit={onFormSubmit}
  />
);

ForgotPassword.propTypes = {
  locale: PropTypes.string,
  Layout: PropTypes.func.isRequired,
  member: PropTypes.shape({}).isRequired,
  onFormSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string,
};

ForgotPassword.defaultProps = {
  locale: null,
  errorMessage: null,
};

const mapStateToProps = state => ({
  locale: state.locale || null,
  member: state.member || {},
  isLoading: state.status.loading || false,
  infoMessage: state.status.info || null,
  errorMessage: state.status.error || null,
  successMessage: state.status.success || null,
});

const mapDispatchToProps = {
  onFormSubmit: resetPassword,
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
