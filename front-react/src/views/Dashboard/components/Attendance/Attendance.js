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
import Alarm from '@material-ui/icons/Alarm';
import AlarmOff from '@material-ui/icons/AlarmOff';

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
    height:"85%"
  }
}));

const Attendance = props => {
  const { className, ...rest } = props;

  const classes = useStyles();
  const theme = useTheme();

  const data = {
    datasets: [
      {
        data: [props.late,props.attendance],
        backgroundColor: [
          "#f17808",
          theme.palette.primary.main,
          theme.palette.success.main
        ],
        borderWidth: 8,
        borderColor: theme.palette.white,
        hoverBorderColor: theme.palette.white
      }
    ],
    labels: ['지각', '출근']
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

  const attendancees = [
    {
        title: '출근',
        value: props.attendance,
        icon: <Alarm />,
        color: theme.palette.primary.main
    },
    {
        title: '지각',
        value: props.late,
        icon: <AlarmOff />,
        color: "#f17808"
    },
  ];

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        title="금일 출근"
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
        { props.attendance + props.late !== 0 ?
          <div className={classes.chartContainer}>
            <Doughnut
              onElementsClick={() => {props.history.push('access/attendance')}}
              data={data}
              options={options}
            />
          </div> : <div></div>
        }
        <div className={classes.stats}>
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
                {attendance.value}명
              </Typography>
            </div>
          ))}
        </div>
        </Grid>
      </CardContent>
    </Card>
  );
};

Attendance.propTypes = {
  className: PropTypes.string
};

export default Attendance;
