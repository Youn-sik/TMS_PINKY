import React, { useState } from 'react';
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
  TableContainer,
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
    height:"430px"
  },
  temp:{
    width:"15px"
  }
}));

const TempAlert = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className),classes.cardStyle}
    >
      <CardHeader
        title="온도 경고"
      />
      <Divider />
      <CardContent className={classes.content}>
          <TableContainer>
            <Table className={classes.inner}>
              <TableHead>
                <TableRow>
                  <TableCell>사진</TableCell>
                  <TableCell>온도</TableCell>
                  <TableCell>타입,날짜</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.temp.map(person => (
                  <TableRow
                    hover
                    key={person._id}
                  >
                    <TableCell>                
                      <img
                        alt="Product"
                        className={classes.image}
                        src={person.avatar_file_url}
                      /></TableCell>
                    <TableCell>{person.avatar_temperature}</TableCell>
                    <TableCell>
                      <ListItemText
                        primary={person.avatar_type === 1 ? "사원" :
                                person.avatar_type === 2 ? '방문자' :
                                person.avatar_type === 3 ? '미등록자' : '블랙리스트'}
                        secondary={`${person.access_time} 출입`}
                      />  
                    </TableCell>
                  </TableRow>
                ))}
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
