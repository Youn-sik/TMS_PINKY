import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Typography
} from '@material-ui/core';
import PermIdentity from '@material-ui/icons/PermIdentity';
import NotInterested from '@material-ui/icons/NotInterested';
import PeopleIcon from '@material-ui/icons/PeopleOutlined';
import AttachMoneyIcon from '@material-ui/icons/HelpOutline';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%'
  },
  chartContainer: {
    position: 'relative',
    height: '300px'
  },
  stats: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
    width: '100%'
  },
  access: {
    textAlign: 'center',
    padding: theme.spacing(1)
  },
  accessIcon: {
    color: theme.palette.icon
  },
  cardContent: {
    height: '85%'
  }
}));

const Access = props => {
  const { className, ...rest } = props;

  const classes = useStyles();
  const theme = useTheme();

  const data = {
    datasets: [
      {
        data:  [props.stranger,props.black,props.employee,],
        backgroundColor: [
          '#bdbdbd',
          theme.palette.error.main,
          theme.palette.primary.main,
        ],
        borderWidth: 8,
        borderColor: theme.palette.white,
        hoverBorderColor: theme.palette.white
      }
    ],
    labels: ['미등록자','블랙리스트','사원',]
  };

  const options = {
    legend: {
      display: false,
      onHover: function(e) {
        e.target.style.cursor = 'pointer';
      }
    },
    hover: {
      onHover: function(e) {
        var point = this.getElementAtEvent(e);
        if (point.length) e.target.style.cursor = 'pointer';
        else e.target.style.cursor = 'default';
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    cutoutPercentage: 80,
    layout: { padding: 0 },
    tooltips: {
      enabled: true,
      mode: 'index',
      borderWidth: 1,
      borderColor: theme.palette.divider,
      backgroundColor: theme.palette.white,
      titleFontColor: theme.palette.text.primary,
      bodyFontColor: theme.palette.text.secondary,
      footerFontColor: theme.palette.text.secondary
    }
  };

  const accesses = [
    {
      title: '사원',
      value: props.employee,
      icon: <PermIdentity />,
      color: theme.palette.primary.main
    },
    {
      title: '블랙리스트',
      value: props.black,
      icon: <NotInterested />,
      color: theme.palette.error.main
    },
    {
      title: '미등록자',
      value: props.stranger,
      icon: <AttachMoneyIcon />,
      color: '#bdbdbd'
    }
  ];

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader title="주간 출입" />
      <Divider />
      <CardContent className={classes.cardContent}>
        <Grid
          className={classes.cardContent}
          container
          direction="row"
          justify="center"
          alignItems="center">
          {props.employee + props.visitor + props.black + props.stranger !==
          0 ? (
            <div className={classes.chartContainer}>
              <Doughnut
                onElementsClick={() => {
                  props.history.push('access/records');
                }}
                data={data}
                options={options}
              />
            </div>
          ) : (
            <div></div>
          )}
          <div className={classes.stats}>
            {accesses.map(access => (
              <div className={classes.access} key={access.title}>
                <span className={classes.accessIcon}>{access.icon}</span>
                <Typography variant="body1">{access.title}</Typography>
                <Typography style={{ color: access.color }} variant="h2">
                  {access.value}명
                </Typography>
              </div>
            ))}
          </div>
        </Grid>
      </CardContent>
    </Card>
  );
};

Access.propTypes = {
  className: PropTypes.string
};

export default Access;
