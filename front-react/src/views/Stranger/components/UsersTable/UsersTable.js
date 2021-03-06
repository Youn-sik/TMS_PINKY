import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Pagination from '@material-ui/lab/Pagination';
import { NavLink as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import {
  Card,
  CardActions,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  TableContainer,
  Paper
} from '@material-ui/core';

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
    margin: '0 0 0 3px',
    marginRight: theme.spacing(2)
  },
  hightTempAvatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
  },
  highTempRow: {
    borderLeft: '3px solid red',
    background: 'rgba(255, 204, 204, 0.575)'
  },
  redFont: {
    color: 'red'
  }
}));

const UsersTable = props => {
  const {
    sortAccesses,
    activeType,
    loading,
    className,
    accesses,
    ...rest
  } = props;

  const classes = useStyles();

  const rowsPerPage = 7;
  const [page, setPage] = useState(1);

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const [sort, setSort] = useState('desc');
  const createSortHandler = headerType => {
    if (sort === 'desc') {
      setSort('asc');
      sortAccesses('asc', headerType);
    } else {
      setSort('desc');
      sortAccesses('desc', headerType);
    }
  };

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardContent className={classes.content}>
        {loading ? <LinearProgress style={{ width: '100%' }} /> : null}
        <TableContainer component={Paper}>
          <Table className={classes.inner} size="small">
            <TableHead>
              <TableRow>
                <TableCell>??????</TableCell>
                <TableCell>??????</TableCell>
                <TableCell>??????</TableCell>
                <TableCell>
                  {props.accesses.length > 0 ? (
                    <TableSortLabel
                      active={activeType === 'avatar_temperature'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('avatar_temperature');
                      }}>
                      ??????
                    </TableSortLabel>
                  ) : (
                    '??????'
                  )}
                </TableCell>
                <TableCell>
                  {props.accesses.length > 0 ? (
                    <TableSortLabel
                      active={activeType === 'access_time'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('access_time');
                      }}>
                      ????????????
                    </TableSortLabel>
                  ) : (
                    '????????????'
                  )}
                </TableCell>
                <TableCell>??????</TableCell>
              </TableRow>
            </TableHead>
            {
              <TableBody>
                {props.accesses
                  .slice(
                    (page - 1) * rowsPerPage,
                    (page - 1) * rowsPerPage + rowsPerPage
                  )
                  .map(access => {
                    if (access.avatar_temperature >= props.tempLimit) {
                      //?????? ?????? 37.5??? ????????????
                      return (
                        <TableRow
                          className={classes.highTempRow}
                          key={access._id}>
                          <TableCell>
                            <div className={classes.nameContainer}>
                              <img
                                alt="???????????????"
                                height="90px"
                                width="70px"
                                className={classes.hightTempAvatar}
                                src={access.avatar_file_url}></img>
                            </div>
                          </TableCell>
                          <TableCell className={classes.redFont}>
                            {access.avatar_type === 1
                              ? '??????'
                              : access.avatar_type === 2
                              ? '?????????'
                              : access.avatar_type === 4
                              ? '???????????????'
                              : '????????????'}
                          </TableCell>
                          <TableCell>
                            {access.avatar_distance
                              ? String(access.avatar_distance).substr(0, 3)
                              : 0}
                          </TableCell>
                          <TableCell className={classes.redFont}>
                            {props.tempType === 1
                              ? String(access.avatar_temperature).substring(
                                  0,
                                  4
                                )
                              : access.avatar_temperature < props.tempLimit
                              ? '????????????'
                              : '????????? ??????'}
                          </TableCell>
                          <TableCell>{access.access_time}</TableCell>
                          <TableCell>
                            <RouterLink
                              style={{ textDecoration: 'none' }}
                              to={{
                                pathname: '/users/stranger/add',
                                userObject: {
                                  avatar_file_url: access.avatar_file_url,
                                  avatar_file: access.avatar_file,
                                  _id: access.avatar_file_url
                                }
                              }}>
                              <Button variant="contained" color="primary">
                                ??????
                              </Button>
                            </RouterLink>
                          </TableCell>
                        </TableRow>
                      );
                    } else {
                      return (
                        <TableRow className={classes.tableRow} key={access._id}>
                          <TableCell>
                            <div className={classes.nameContainer}>
                              <img
                                alt="???????????????"
                                height="90px"
                                width="70px"
                                className={classes.avatar}
                                src={access.avatar_file_url}></img>
                            </div>
                          </TableCell>
                          <TableCell>
                            {access.avatar_type === 1
                              ? '??????'
                              : access.avatar_type === 2
                              ? '?????????'
                              : access.avatar_type === 4
                              ? '???????????????'
                              : '????????????'}
                          </TableCell>
                          <TableCell>
                            {access.avatar_distance
                              ? String(access.avatar_distance).substr(0, 3)
                              : 0}
                          </TableCell>
                          <TableCell>
                            {props.tempType === 1
                              ? String(access.avatar_temperature).substring(
                                  0,
                                  4
                                )
                              : access.avatar_temperature < props.tempLimit
                              ? '????????????'
                              : '????????? ??????'}
                          </TableCell>
                          <TableCell>{access.access_time}</TableCell>
                          <TableCell>
                            <RouterLink
                              style={{ textDecoration: 'none' }}
                              to={{
                                pathname: '/users/stranger/add',
                                userObject: access
                              }}>
                              <Button variant="contained" color="primary">
                                ??????
                              </Button>
                            </RouterLink>
                          </TableCell>
                        </TableRow>
                      );
                    }
                  })}
              </TableBody>
            }
          </Table>
        </TableContainer>
      </CardContent>
      <CardActions className={classes.actions}>
        <Grid container alignItems="center" justify="center">
          <Pagination
            count={
              props.accesses.length % rowsPerPage === 0
                ? parseInt(props.accesses.length / rowsPerPage)
                : parseInt(
                    props.accesses.length / rowsPerPage +
                      parseInt(props.accesses.length % rowsPerPage) /
                        parseInt(props.accesses.length % rowsPerPage)
                  )
            }
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
  className: PropTypes.string
};

export default UsersTable;
