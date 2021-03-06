import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles,useTheme } from '@material-ui/styles';
import { Card, CardContent, Grid, Typography, Avatar } from '@material-ui/core';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%'
  },
  content: {
    alignItems: 'center',
    display: 'flex'
  },
  title: {
    fontWeight: 700
  },
  avatar: {
    backgroundColor: '#bdbdbd',
    color: theme.palette.white,
    height: 56,
    width: 56
  },
  icon: {
    height: 32,
    width: 32
  }
}));

const Stranger = props => {
  const { className, ...rest } = props;

  const classes = useStyles();
  const theme = useTheme();

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardContent>
        <Grid container justify="space-between">
          <Grid item>
            <Typography
              className={classes.title}
              color="inherit"
              gutterBottom
              variant="body2">
              미등록자
            </Typography>
            <Typography color="inherit" variant="h3">
              {props.count}명
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              style={{ cursor: 'pointer' }}
              onClick={() => {
                props.history.push('access/records');
              }}
              className={classes.avatar}>
              <HelpOutlineIcon className={classes.icon} />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

Stranger.propTypes = {
  className: PropTypes.string
};

export default Stranger;
