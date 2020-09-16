import React from 'react';
import { Line } from 'react-chartjs-2';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%'
  },
  chartContainer: {
    position: 'relative',
    height: '300px',
    width: '100%'
  },
  stats: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
    width:"100%"
  },
  access: {
    textAlign: 'center',
    padding: theme.spacing(1)
  },
  accessIcon: {
    color: theme.palette.icon
  },
  cardContent: {
    height:"85%",
  }
}));

const DeviceStats = props => {
  const { chartData,className, date, ...rest } = props;

  const classes = useStyles();

  const data = {
    datasets: [
      {
        label:"사원",
        data: chartData.employee,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 2
      },
      {
        label:"방문자",
        data: chartData.visitor,
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 2
      },
      {
        label:"미등록자",
        data: chartData.stranger,
        backgroundColor: [
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 159, 64, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 2
      },
      {
        label:"블랙리스트",
        data: chartData.black,
        backgroundColor: [
          'rgba(255, 206, 86, 0.2)',
        ],
        borderColor: [
          'rgba(255, 206, 86, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 2
      }
    ],
    labels: date
  };

  const options = {
    legend: {
      display: true
    },
    responsive: true,
    maintainAspectRatio: false,
    cutoutPercentage: 80,
    layout: { padding: 0 },
    scales: {
      yAxes: [{
          ticks: {
              beginAtZero: true
          }
      }]
    },
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        title="단말별 출입 통계"
      />
      <Divider />
      <CardContent className={classes.cardContent}>
        <Grid 
          className={classes.cardContent} 
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          <div className={classes.chartContainer}>
            <Line
              data={data}
              options={options}
            />
          </div>
       {/* {props.employee + props.visitor + props.black + props.stranger !== 0 ?
        <div className={classes.chartContainer}>
          <Line
            data={data}
            options={options}
          />
        </div> : <div></div>}
        <div className={classes.stats}>
          {accesses.map(access => (
            <div
              className={classes.access}
              key={access.title}
            >
              <span className={classes.accessIcon}>{access.icon}</span>
              <Typography variant="body1">{access.title}</Typography>
              <Typography
                style={{ color: access.color }}
                variant="h2"
              >
                {access.value}명
              </Typography>
            </div>
          ))}
        </div> */}
        </Grid>
      </CardContent>
    </Card>
  );
};

DeviceStats.propTypes = {
  className: PropTypes.string
};

export default DeviceStats;