import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import Pagination from '@material-ui/lab/Pagination';
import { NavLink as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import {
  Card,
  CardActions,
  CardContent,
  Avatar,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Button,
  TablePagination,
  TableContainer,
  Paper
} from '@material-ui/core';

import { getInitials } from 'helpers';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 1050
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    margin:"0 0 0 3px",
    marginRight: theme.spacing(2)
  },
  hightTempAvatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
  },
  highTempRow:{
    borderLeft:'3px solid red',
    background : 'rgba(255, 204, 204, 0.575)',
  },
  redFont:{
    color:'red'
  },
}));

const UsersTable = props => {
  const { loading,className,accesses, ...rest } = props;

  const classes = useStyles();

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [page, setPage] = useState(1);

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent className={classes.content}>
        {loading ? <LinearProgress style={{width:'100%'}} /> : null}
        <TableContainer component={Paper}>
            <Table className={classes.inner} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>사진</TableCell>
                  <TableCell>타입</TableCell>
                  <TableCell>온도</TableCell>
                  <TableCell>출입시간</TableCell>
                  <TableCell>등록</TableCell>
                </TableRow>
              </TableHead>
              {
                <TableBody>
                  {props.accesses.slice((page-1) * rowsPerPage, (page-1) * rowsPerPage + rowsPerPage).map(access => {
                    if(access.avatar_temperature >= 37.5){ //출입 기록 37.5도 이상일때
                      return(
                        <TableRow
                          className={classes.highTempRow}
                          key={props.accesses._id}
                        >
                          <TableCell>
                            <div className={classes.nameContainer}>
                              <img
                                height="90px"
                                width="70px"
                                className={classes.hightTempAvatar}
                                src={access.avatar_file_url}
                              >
                              </img>
                            </div>
                          </TableCell>
                          <TableCell className={classes.redFont}>{access.avatar_type === 1 ? "사원" :
                                      access.avatar_type === 2 ? "방문자" : 
                                      access.avatar_type === 4 ? '블랙리스트' : '미등록자'}</TableCell>
                          <TableCell className={classes.redFont}>{String(access.avatar_temperature).substring(0,4)}</TableCell>
                          <TableCell>{access.access_time}</TableCell>
                          <TableCell>
                            <RouterLink style={{ textDecoration: 'none' }} to={{
                            pathname:"/users/stranger/add",
                            userObject:access,
                            }}><Button variant="contained" color="primary">등록</Button></RouterLink>
                          </TableCell>
                        </TableRow>
                      )
                    } else {
                      return(
                        <TableRow
                          className={classes.tableRow}
                          key={props.accesses._id}
                        >
                          <TableCell>
                            <div className={classes.nameContainer}>
                              <img
                                height="90px"
                                width="70px"
                                className={classes.avatar}
                                src={access.avatar_file_url}
                              >
                              </img>
                            </div>
                          </TableCell>
                          <TableCell>{access.avatar_type === 1 ? "사원" :
                                      access.avatar_type === 2 ? "방문자" : 
                                      access.avatar_type === 4 ? '블랙리스트' : '미등록자'}</TableCell>
                          <TableCell>{String(access.avatar_temperature).substring(0,4)}</TableCell>
                          <TableCell>{access.access_time}</TableCell>
                          <TableCell>
                            <RouterLink style={{ textDecoration: 'none' }} to={{
                            pathname:"/users/stranger/add",
                            userObject:access,
                            }}><Button variant="contained" color="primary">등록</Button></RouterLink>
                          </TableCell>
                        </TableRow>
                      )
                    }
                    })}
                </TableBody>
              }
            </Table>
          </TableContainer>
      </CardContent>
      <CardActions className={classes.actions}>
        <Grid
          container
          alignItems="center"
          justify="center"
        >
         <Pagination
          count={ props.accesses.length%rowsPerPage === 0 ? parseInt(props.accesses.length/rowsPerPage) :
            parseInt(props.accesses.length/rowsPerPage+(parseInt(props.accesses.length%rowsPerPage)/parseInt(props.accesses.length%rowsPerPage)))}
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

UsersTable.propTypes = {
  className: PropTypes.string,
};



export default UsersTable;
