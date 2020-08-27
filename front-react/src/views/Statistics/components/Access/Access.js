import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';

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
    height:"520px"
  },
  temp:{
    width:"15px"
  }
}));

const Access = props => {
  const { clickedNode,className, ...rest } = props;

  const classes = useStyles();

  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [page, setPage] = useState(1);

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className),classes.cardStyle}
    >
      <CardHeader
        title="출입 기록"
      />
      <Divider />
      <CardContent className={classes.content}>
        <List>
          {Object.keys(clickedNode).length ?
          null:<div style={{textAlign: 'center'}}>그룹에서 사용자를 선택해주세요.</div>}
          {props.temp.slice((page-1) * rowsPerPage, (page-1) * rowsPerPage + rowsPerPage).map((people, i) => (
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
                secondary={`2020-08-24 08:55:26 출입`}
              />
              <div>
                {`${String(people.avatar_temperature).substring(0,4)}℃`}
              </div>
            </ListItem>
          ))}
          {props.temp.slice((page-1) * rowsPerPage, (page-1) * rowsPerPage + rowsPerPage).map((people, i) => (
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
                secondary={`2020-08-25 08:58:55 출입`}
              />
              <div>
                {`${String(people.avatar_temperature).substring(0,4)}℃`}
              </div>
            </ListItem>
          ))}
          {props.temp.slice((page-1) * rowsPerPage, (page-1) * rowsPerPage + rowsPerPage).map((people, i) => (
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
      <CardActions className={classes.actions}>
        <Grid
          container
          alignItems="center"
          justify="center"
        >
         <Pagination
          count={ props.temp.length%rowsPerPage === 0 ? parseInt(props.temp.length/rowsPerPage) :
            parseInt(props.temp.length/rowsPerPage+(parseInt(props.temp.length%rowsPerPage)/parseInt(props.temp.length%rowsPerPage)))}
          onChange={handlePageChange}
          page={page}
          variant="outlined" 
          shape="rounded"
          />
        </Grid>
      </CardActions>
    </Card>
  );
};

Access.propTypes = {
  className: PropTypes.string
};

export default Access;
