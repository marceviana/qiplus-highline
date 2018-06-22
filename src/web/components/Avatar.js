import React from 'react';
import PropTypes from 'prop-types';

const Avatar = ({ src, style }) => {
  if (!src) return <div className="avatar-icon" style={style}><i className="icon-user" style={{ fontSize: 40 }} /></div>;
  return (
    <div style={style} className="avatar-img">
      {!!src && <img alt="" src={src} />}
    </div>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  style: PropTypes.any,
};

Avatar.defaultProps = {
  src: '',
  style: {},
};

export default Avatar;
