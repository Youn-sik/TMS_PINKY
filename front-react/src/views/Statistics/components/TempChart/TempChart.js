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
import Done from '@material-ui/icons/Done';
import Block from '@material-ui/icons/Block';

const useStyles = makeStyles(theme => ({
  root: {
    height: '199.4%',
  },
  chartContainer: {
    position: 'relative',
    top:120,
    height: '400px',
    maxHeight: '400px',
    textAlign: 'center'
  },
  stats: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
    width:"100%"
  },
  attendance: {
    textAlign: 'center',
    padding: theme.spacing(1)
  },
  attendanceIcon: {
    color: theme.palette.icon
  },
  cardContent: {
    height:"100%"
  }
}));

const TempChart = props => {
  const { history,clickedNode,className, ...rest } = props;

  const classes = useStyles();
  const theme = useTheme();

  const data = {
    datasets: [
      {
        data: [props.late,props.attendance],
        backgroundColor: [
          theme.palette.error.main,
          theme.palette.success.main,
          theme.palette.success.main
        ],
        borderWidth: 8,
        borderColor: theme.palette.white,
        hoverBorderColor: theme.palette.white
      }
    ],
    labels: ['정상 온도','비정상 온도']
  };

  const options = {
    legend: {
      display: false,
      onHover: function(e) {
        console.log(e.target.style)
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

  const attendancees = [
    {
        title: '정상 온도',
        value: props.attendance,
        icon: <Done />,
        color: theme.palette.success.main
    },
    {
        title: '비정상 온도',
        value: props.late,
        icon: <Block />,
        color: theme.palette.error.main
    },
  ];

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        title="온도통계"
      />
      <Divider />
      {/* <CardContent className={classes.cardContent}> */}
        {/* <Grid 
          className={classes.cardContent} 
          container
          direction="row"
          justify="center"
          alignItems="center"
          
        > */}
          <div className={classes.chartContainer}>
            <Doughnut
              onElementsClick={() => {props.history.push('/access/records')}}
              data={data}
              options={options}
            /> 
          </div> 
        <div className={classes.stats} style={{position:'relative',bottom:150}}>
          {attendancees.map(attendance => (
            <div
              className={classes.attendance}
              key={attendance.title}
            >
              <span className={classes.attendanceIcon}>{attendance.icon}</span>
              <Typography variant="body1">{attendance.title}</Typography>
              <Typography
                style={{ color: attendance.color }}
                variant="h2"
              >
                {attendance.value}번
              </Typography>
            </div>
          ))}
        </div>
        {/* </Grid> */}
      {/* </CardContent> */}
    </Card>
  );
};

TempChart.propTypes = {
  className: PropTypes.string
};

export default TempChart;
