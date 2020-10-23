import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Typography, Link } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  // root: {
  //   padding: theme.spacing(4)
  // }
}));

const Footer = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  return (
    <div>
      {/* <Typography variant="body1">
        &copy;{' '}
        <Link component="a" target="_blank">
          Koolsign
        </Link>
        . 2019
      </Typography> */}
    </div>
  );
};

Footer.propTypes = {
  className: PropTypes.string
};

export default Footer;
