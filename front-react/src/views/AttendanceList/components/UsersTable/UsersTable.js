import React, { useState,useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Pagination from '@material-ui/lab/Pagination';
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
  TablePagination
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
    marginRight: theme.spacing(2)
  },
  hightTempAvatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
  },
}));

const UsersTable = props => {
  const { loading,className,users, ...rest } = props;

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
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>사진</TableCell>
                  <TableCell>근무지</TableCell>
                  <TableCell>부서</TableCell>
                  <TableCell>직급</TableCell>
                  <TableCell>출근</TableCell>
                  <TableCell>지각</TableCell>
                </TableRow>
              </TableHead>
              {loading ? <LinearProgress style={{padding:"0 230%"}} /> : null}
              <TableBody>
                {props.users.slice((page-1) * rowsPerPage, (page-1) * rowsPerPage + rowsPerPage).map(user => {
                  return(
                    <TableRow
                      key={props.users._id}
                    >
                      <TableCell>
                        <div className={classes.nameContainer}>
                          <img
                            height="90px"
                            width="70px"
                            src={user.avatar_file_url}
                          >
                          </img>
                        </div>
                      </TableCell>
                      <TableCell>{user.location}</TableCell>
                      <TableCell>{user.department_id}</TableCell>
                      <TableCell>{user.position}</TableCell>
                      <TableCell>{user.attendance}</TableCell>
                      <TableCell>{user.late}</TableCell>
                    </TableRow>
                  )
                  })}
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
      <CardActions className={classes.actions}>
        <Grid
          container
          alignItems="center"
          justify="center"
        >
         <Pagination
          count={ props.users.length%rowsPerPage === 0 ? parseInt(props.users.length/rowsPerPage) :
            parseInt(props.users.length/rowsPerPage+(parseInt(props.users.length%rowsPerPage)/parseInt(props.users.length%rowsPerPage)))}
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
