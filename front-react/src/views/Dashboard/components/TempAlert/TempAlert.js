import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

import mockData from './data';

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

  const [products] = useState(mockData);

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
        <List>
          {props.temp.map((people, i) => (
            <ListItem
              divider={i < props.temp.length - 1}
              key={people._id}
            >
              <ListItemAvatar>
                <img
                  alt="Product"
                  className={classes.image}
                  src={people.avatar_file_url}
                />
              </ListItemAvatar>
              <ListItemText
                primary={people.avatar_type === 1 ? "사원" :
                        people.avatar_type === 2 ? '방문자' :
                        people.avatar_type === 3 ? '미등록자' : '블랙리스트'}
                secondary={`${people.access_time} 출입`}
              />
              <div>
                {`${String(people.avatar_temperature).substring(0,4)}℃`}
              </div>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

TempAlert.propTypes = {
  className: PropTypes.string
};

export default TempAlert;
