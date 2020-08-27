import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Pagination from '@material-ui/lab/Pagination';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import {
  Card,
  CardActions,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
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
    marginRight: theme.spacing(2)
  },
  hightTempAvatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
  },
}));

const OperTable = props => {
  const { loading,className,oper, ...rest } = props;

  const classes = useStyles();
  const rowsPerPage= 7;
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
                  <TableCell>아이디</TableCell>
                  <TableCell>날짜</TableCell>
                  <TableCell>행동</TableCell>
                  <TableCell>상세</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/*TO DO : oper에서 중요한 개인정보 나오지 않도록 하기*/}
                {oper.slice((page-1) * rowsPerPage, (page-1) * rowsPerPage + rowsPerPage).map(oper => {
                  return(
                    <TableRow
                      key={oper._id}
                    >
                      <TableCell>{oper.id.user_id}</TableCell>
                      <TableCell>{oper.date}</TableCell>
                      <TableCell>{oper.action}</TableCell>
                      <TableCell>{oper.description}</TableCell>
                    </TableRow>
                  )
                  })}
              </TableBody>
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
          count={ oper.length%rowsPerPage === 0 ? parseInt(oper.length/rowsPerPage) :
            parseInt(oper.length/rowsPerPage+(parseInt(oper.length%rowsPerPage)/parseInt(oper.length%rowsPerPage)))}
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

OperTable.propTypes = {
  className: PropTypes.string,
};



export default OperTable;
