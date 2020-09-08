import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Pagination from '@material-ui/lab/Pagination';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import {
  Card,
  CardActions,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  LinearProgress,
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

const ErrorsTable = props => {
  const { loading,className,errors, ...rest } = props;

  const classes = useStyles();

  const rowsPerPage = 10;
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
        {loading ? <LinearProgress style={{width: '100%'}}/> : null}
        <TableContainer component={Paper}>
            <Table className={classes.inner} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>단말기 명</TableCell>
                  <TableCell>시리얼 넘버</TableCell>
                  <TableCell>로그 메세지</TableCell>
                  <TableCell>날짜</TableCell>
                </TableRow>
              </TableHead>
              {
                
                <TableBody>
                    {errors.map(error => (
                      <TableRow
                        className={classes.tableRow}
                        key={error._id}
                      >
                        <TableCell>
                          {error.stb_id}
                        </TableCell>
                        <TableCell>{error.stb_sn}</TableCell>
                        <TableCell>{error.log_message}</TableCell>
                        <TableCell>{error.create_dt}</TableCell>
                      </TableRow>
                    ))}
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
          count={ errors.length%rowsPerPage === 0 ? parseInt(errors.length/rowsPerPage) :
            parseInt(errors.length/rowsPerPage+(parseInt(errors.length%rowsPerPage)/parseInt(errors.length%rowsPerPage)))}
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

ErrorsTable.propTypes = {
  className: PropTypes.string,
};



export default ErrorsTable;
