import React from 'react';
import { Line } from 'react-chartjs-2';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import { Card, CardHeader, CardContent, Divider,Button } from '@material-ui/core';

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

const DeviceStats = props => {
  const { chartData,clickAccessExport, className, date, ...rest } = props;

  const classes = useStyles();

  const data = {
    datasets: [
      // {
      //   label: '정상 온도',
      //   data: chartData.normal,
      //   backgroundColor: ['rgba(255, 99, 132, 0.2)'],
      //   borderColor: [
      //     'rgba(255, 99, 132, 1)',
      //     'rgba(255, 99, 132, 1)',
      //     'rgba(255, 99, 132, 1)',
      //     'rgba(255, 99, 132, 1)',
      //     'rgba(255, 99, 132, 1)',
      //     'rgba(255, 99, 132, 1)',
      //     'rgba(255, 99, 132, 1)'
      //   ],
      //   borderWidth: 2
      // },
      // {
      //   label: '방문자',
      //   data: chartData.visitor,
      //   backgroundColor: ['rgba(75, 192, 192, 0.2)'],
      //   borderColor: [
      //     'rgba(75, 192, 192, 1)',
      //     'rgba(75, 192, 192, 1)',
      //     'rgba(75, 192, 192, 1)',
      //     'rgba(75, 192, 192, 1)',
      //     'rgba(75, 192, 192, 1)',
      //     'rgba(75, 192, 192, 1)',
      //     'rgba(75, 192, 192, 1)'
      //   ],
      //   borderWidth: 2
      // },
      // {
      //   label: '비정상 온도',
      //   data: chartData.abnormal,
      //   backgroundColor: ['rgba(255, 159, 64, 0.2)'],
      //   borderColor: [
      //     'rgba(255, 159, 64, 1)',
      //     'rgba(255, 159, 64, 1)',
      //     'rgba(255, 159, 64, 1)',
      //     'rgba(255, 159, 64, 1)',
      //     'rgba(255, 159, 64, 1)',
      //     'rgba(255, 159, 64, 1)',
      //     'rgba(255, 159, 64, 1)'
      //   ],
      //   borderWidth: 2
      // },
      {
        label: '출입자 수',
        data: chartData.all,
        backgroundColor: ['rgba(255, 99, 132, 0.2)'],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 99, 132, 1)'
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
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
            // OR //
            beginAtZero: true   // minimum value will be 0.
          }
        }
      ]
    }
  };

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader title={
            <div>
                <span>단말별 출입자 통계</span>
                <Button
                size="small"
                style={{float: 'right',marginRight:'10px' }} 
                variant="contained" color="primary" onClick={clickAccessExport}>
                  엑셀로 다운로드
                </Button>
            </div>
          }/>
      <Divider />
      <CardContent className={classes.cardContent}>
        <Grid
          className={classes.cardContent}
          container
          direction="row"
          justify="center"
          alignItems="center">
          <div className={classes.chartContainer}>
            <Line data={data} options={options} />
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
