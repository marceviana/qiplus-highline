import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { updateProfile } from '../actions/member';

const UpdateProfile = ({
  Layout,
  onFormSubmit,
  member,
  locale,
  isLoading,
  errorMessage,
  successMessage,
}) => (
  <Layout
    member={member}
    locale={locale}
    loading={isLoading}
    error={errorMessage}
    success={successMessage}
    onFormSubmit={onFormSubmit}
  />
);

UpdateProfile.propTypes = {
  locale: PropTypes.string,
  Layout: PropTypes.func.isRequired,
  member: PropTypes.shape({}).isRequired,
  onFormSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string,
  successMessage: PropTypes.string,
};

UpdateProfile.defaultProps = {
  locale: null,
  errorMessage: null,
  successMessage: null,
};

const mapStateToProps = state => ({
  locale: state.locale || null,
  member: state.member || {},
  isLoading: state.status.loading || false,
  errorMessage: state.status.error || null,
  successMessage: state.status.success || null,
});

const mapDispatchToProps = {
  onFormSubmit: updateProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProfile);
