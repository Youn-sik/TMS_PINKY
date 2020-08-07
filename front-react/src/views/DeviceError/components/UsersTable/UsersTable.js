import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Pagination from '@material-ui/lab/Pagination';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
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
  TablePagination,
  LinearProgress
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

  const [rowsPerPage, setRowsPerPage] = useState(10);
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
                  <TableCell>단말기 명</TableCell>
                  <TableCell>시리얼 넘버</TableCell>
                  <TableCell>날짜</TableCell>
                  <TableCell>로그 메세지</TableCell>
                </TableRow>
              </TableHead>
              {loading ? <LinearProgress style={{width: '390%'}}/> : null}
              {
                
                <TableBody>
                    {accesses.map(access => (
                      <TableRow
                        className={classes.tableRow}
                        key={access._id}
                      >
                        <TableCell>
                          {access.stb_id}
                        </TableCell>
                        <TableCell>{access.stb_sn}</TableCell>
                        <TableCell>{access.create_dt}</TableCell>
                        <TableCell>{access.log_message}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              }
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
