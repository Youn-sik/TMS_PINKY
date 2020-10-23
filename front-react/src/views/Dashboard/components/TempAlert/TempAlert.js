import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  ListItemText,
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
  highTempRow: {
    borderLeft: '3px solid red',
    background: 'rgba(255, 204, 204, 0.575)'
  },
  redFont: {
    color: 'red'
  }
}));

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
                <TableCell>온도</TableCell>
                {/* <TableCell>타입</TableCell> */}
                <TableCell>날짜</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {temp.map(access =>
                access.avatar_temperature >= tempLimit ? (
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
                        src={access.avatar_file_url}
                      />
                    </TableCell>
                    <TableCell className={classes.redFont}>
                      {tempType === 1
                        ? String(access.avatar_temperature).substring(0, 4)
                        : '비정상 체온'}
                    </TableCell>
                    {/* <TableCell className={classes.redFont}>
                      {access.avatar_type === 1
                        ? '사원'
                        : access.avatar_type === 2
                        ? '방문자'
                        : access.avatar_type === 3
                        ? '미등록자'
                        : '블랙리스트'}
                    </TableCell> */}
                    <TableCell className={classes.redFont}>
                      {access.access_time}
                    </TableCell>
                  </TableRow>
                ) : (
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
                        src={access.avatar_file_url}
                      />
                    </TableCell>
                    <TableCell>
                      {tempType === 1
                        ? String(access.avatar_temperature).substring(0, 4)
                        : '정상 체온'}
                    </TableCell>
                    <TableCell>
                      {access.avatar_type === 1
                        ? '사원'
                        : access.avatar_type === 2
                        ? '방문자'
                        : access.avatar_type === 3
                        ? '미등록자'
                        : '블랙리스트'}
                    </TableCell>
                    <TableCell>{access.access_time}</TableCell>
                  </TableRow>
                )
              )}
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
