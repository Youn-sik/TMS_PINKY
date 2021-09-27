import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Grid, Tooltip } from '@material-ui/core';
import { Card, CardHeader, CardContent, Divider } from '@material-ui/core';
import './TimeAccess.css';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%'
  },
  chartContainer: {
    position: 'relative',
    height: '600px',
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

const TimeAccess = props => {
  const { chartData, className, date, ...rest } = props;
  const [tooltip, setTooltip] = useState({
    top: 0,
    left: 0,
    date: '',
    value: 0,
    title: '',
    maxTemp: '',
    accessCount: 0
  });
  const classes = useStyles();

  let _chartRef = React.createRef();

  const setPositionAndData = data => {
    setTooltip(data);
  };

  const data = {
    // labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      // {
      //   label: '최고 발열자',
      //   type: 'line',
      //   data: chartData.maxTemp,
      //   fill: false,
      //   borderColor: '#EC932F',
      //   backgroundColor: '#EC932F',
      //   pointBorderColor: '#EC932F',
      //   pointBackgroundColor: '#EC932F',
      //   pointHoverBackgroundColor: '#EC932F',
      //   pointHoverBorderColor: '#EC932F',
      //   yAxisID: 'y-axis-2'
      // },
      {
        type: 'bar',
        label: '출입자 수',
        data: chartData.data,
        fill: false,
        backgroundColor: '#71B37C',
        borderColor: '#71B37C',
        hoverBackgroundColor: '#71B37C',
        hoverBorderColor: '#71B37C',
        yAxisID: 'y-axis-1'
      }
    ]
  };

  const options = {
    scaleStartValue : 0 ,
    responsive: true,
    animation: false,
    cutoutPercentage: 80,
    layout: { padding: 0 },
    maintainAspectRatio: false,
    tooltips: {
      enabled: true,
    },
    elements: {
      line: {
        fill: false
      }
    },
    scales: {
      xAxes: [
        {
          display: true,
          gridLines: {
            display: false
          },

          labels: chartData.labels
        }
      ],
      yAxes: [
        {
          type: 'linear',
          display: true,
          position: 'left',
          id: 'y-axis-1',
          gridLines: {
            display: false
          },
          labels: {
            show: true
          },
          ticks: {
            suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
            // OR //
            beginAtZero: true   // minimum value will be 0.
          }
        },
        {
          type: 'linear',
          display: true,
          position: 'right',
          id: 'y-axis-2',
          gridLines: {
            display: false
          },
          labels: {
            show: true
          },
          ticks: {
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
      <CardHeader title="데이터 통계" />
      <Divider />
      <CardContent className={classes.cardContent}>
        <Grid
          style={{hidden:"hidden"}}
          className={classes.cardContent}
          container
          direction="row"
          justify="center"
          alignItems="center">
          <div className={classes.chartContainer}>
            <Bar data={data} options={options} ref={_chartRef} />
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

TimeAccess.propTypes = {
  className: PropTypes.string
};

export default TimeAccess;
