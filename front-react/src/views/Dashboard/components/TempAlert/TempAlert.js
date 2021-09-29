import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%'
  },
  content: {
    padding: 0
  },
  image: {
    height: 60.5,
    width: 48
  },
  actions: {
    justifyContent: 'flex-end'
  },
  cardStyle: {
    height: '540px'
  },
  temp: {
    width: '15px'
  },
  blacklistRow: {
    borderLeft: '3px solid gray',
    background: 'rgba(224, 224, 224, 0.8)'
  },
  highTempRow: {
    borderLeft: '3px solid red',
    background: 'rgba(255, 204, 204, 0.275)'
  },
  emergencyRow: {
    borderLeft: '3px solid red',
    background: 'rgba(255, 102, 102, 0.73)'
  },
  redFont: {
    color: 'red'
  }
}));

let currentUrl = window.location.href
let isOut = false;
// console.log(currentUrl.indexOf("172.16.33.130"))
//
//   isOut = true;
// }

const TempAlert = props => {
  const { temp, tempLimit, tempType, className, ...rest } = props;

  const classes = useStyles();

  return (
    <Card
      {...rest}
      className={(clsx(classes.root, className), classes.cardStyle)}
      style={{ overflow: 'auto' }}>
      <CardHeader title="실시간 출입 정보" />
      <Divider />
      <CardContent className={classes.content}>
        <TableContainer>
          <Table className={classes.inner}>
            <TableHead>
              <TableRow
                onClick={() => {
                  props.history.push('access/records');
                }}>
                <TableCell>사진</TableCell>
                <TableCell>이름</TableCell>
                <TableCell>타입</TableCell>
                <TableCell>소속 학교/원</TableCell>
                <TableCell>학년/반</TableCell>
                <TableCell>단말 위치</TableCell>
                <TableCell>단말명</TableCell>
                <TableCell>단말기 시리얼</TableCell>
                <TableCell>온도</TableCell>
                <TableCell>시간</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {temp.map(access =>{
                if(access.alarm_type == 5){
                  return(
                    <TableRow
                      className={classes.emergencyRow}
                      onClick={() => {
                        props.history.push('access/records');
                      }}
                      key={access._id}>
                      <TableCell>
                        <img
                          alt="picture"
                          className={classes.image}
                          src={isOut ? access.avatar_file_url.replace('172.16.41.114','211.204.122.90') : access.avatar_file_url}
                        />
                      </TableCell>
                      <TableCell className={classes.redFont}>{access.name === 'unknown' ? null : access.name}</TableCell>
                      <TableCell className={classes.redFont}>
                        {access.alarm_type === 1
                          ? '승차'
                          : access.alarm_type === 2
                          ? '하차'
                          : access.alarm_type === 3
                          ? '등원'
                          : access.alarm_type === 4
                          ? '하원'
                          : '비상'}
                      </TableCell>
                      <TableCell className={classes.redFont}>{access.location}</TableCell>
                      <TableCell className={classes.redFont}>{access.position}</TableCell>
                      <TableCell className={classes.redFont}>{access.stb_location}</TableCell>
                      <TableCell className={classes.redFont}>{access.stb_name}</TableCell>
                      <TableCell className={classes.redFont}>{access.stb_sn}</TableCell>
                      <TableCell className={classes.redFont}>
                        
                      </TableCell>
                      <TableCell className={classes.redFont}>
                        {access.access_time}
                      </TableCell>
                    </TableRow>
                    );
                }
                else{
                  if(access.avatar_type == 4){
                    return(
                      <TableRow
                        className={classes.blacklistRow}
                        hover
                        key={access._id}
                        onClick={() => {
                          props.history.push('access/records');
                        }}>
                        <TableCell>
                          <img
                            alt="Product"
                            className={classes.image}
                            src={isOut ? access.avatar_file_url.replace('172.16.41.114','211.204.122.90') : access.avatar_file_url}
                          />
                        </TableCell>
                        <TableCell>{access.name === 'unknown' ? null : access.name}</TableCell>
                        <TableCell>
                        {access.alarm_type === 1
                            ? '승차'
                            : access.alarm_type === 2
                            ? '하차'
                            : access.alarm_type === 3
                            ? '등원'
                            : access.alarm_type === 4
                            ? '하원'
                            : '비상'}
                        </TableCell>
                        <TableCell>{access.name === 'unknown' ? null : access.location}</TableCell>
                        <TableCell>{access.name === 'unknown' ? null : access.position}</TableCell>
                        <TableCell>{access.stb_location}</TableCell>
                        <TableCell>{access.stb_name}</TableCell>
                        <TableCell>{access.stb_sn}</TableCell>
                        <TableCell>
                          {tempType === 1
                            ? String(access.avatar_temperature).substring(0, 4)
                            : '정상 체온'}
                        </TableCell>
                        <TableCell>
                          {access.access_time}
                        </TableCell>
                      </TableRow>
                      );
                  }
                  else{
                    if(access.avatar_temperature >= tempLimit){
                      return(
                      <TableRow
                        className={classes.highTempRow}
                        onClick={() => {
                          props.history.push('access/records');
                        }}
                        key={access._id}>
                        <TableCell>
                          <img
                            alt="picture"
                            className={classes.image}
                            src={isOut ? access.avatar_file_url.replace('172.16.41.114','211.204.122.90') : access.avatar_file_url}
                          />
                        </TableCell>
                        <TableCell className={classes.redFont}>{access.name === 'unknown' ? null : access.name}</TableCell>
                        <TableCell className={classes.redFont}>
                          {access.alarm_type === 1
                            ? '승차'
                            : access.alarm_type === 2
                            ? '하차'
                            : access.alarm_type === 3
                            ? '등원'
                            : access.alarm_type === 4
                            ? '하원'
                            : '비상'}
                        </TableCell>
                        <TableCell className={classes.redFont}>{access.location}</TableCell>
                        <TableCell className={classes.redFont}>{access.position}</TableCell>
                        <TableCell className={classes.redFont}>{access.stb_location}</TableCell>
                        <TableCell className={classes.redFont}>{access.stb_name}</TableCell>
                        <TableCell className={classes.redFont}>{access.stb_sn}</TableCell>
                        <TableCell className={classes.redFont}>
                          {tempType === 1
                            ? String(access.avatar_temperature).substring(0, 4)
                            : '비정상 체온'}
                        </TableCell>
                        <TableCell className={classes.redFont}>
                          {access.access_time.split(" ")[0]}
                        </TableCell>
                      </TableRow>
                      );
                    } else {
                      return(
                      <TableRow
                        hover
                        key={access._id}
                        onClick={() => {
                          props.history.push('access/records');
                        }}>
                        <TableCell>
                          <img
                            alt="Product"
                            className={classes.image}
                            src={isOut ? access.avatar_file_url.replace('172.16.41.114','211.204.122.90') : access.avatar_file_url}
                          />
                        </TableCell>
                        <TableCell>{access.name === 'unknown' ? null : access.name}</TableCell>
                        <TableCell>
                        {access.alarm_type === 1
                            ? '승차'
                            : access.alarm_type === 2
                            ? '하차'
                            : access.alarm_type === 3
                            ? '등원'
                            : access.alarm_type === 4
                            ? '하원'
                            : '비상'}
                        </TableCell>
                        <TableCell>{access.name === 'unknown' ? null : access.location}</TableCell>
                        <TableCell>{access.name === 'unknown' ? null : access.position}</TableCell>
                        <TableCell>{access.stb_location}</TableCell>
                        <TableCell>{access.stb_name}</TableCell>
                        <TableCell>{access.stb_sn}</TableCell>
                        <TableCell>
                          {tempType === 1
                            ? String(access.avatar_temperature).substring(0, 4)
                            : '정상 체온'}
                        </TableCell>
                        <TableCell>
                          {access.access_time}
                        </TableCell>
                      </TableRow>
                      );
                    }
                  }
                }
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

TempAlert.propTypes = {
  className: PropTypes.string
};

export default TempAlert;
