import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Pagination from '@material-ui/lab/Pagination';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import TableSortLabel from '@material-ui/core/TableSortLabel';
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
  }
}));

const OperTable = props => {
  const { sortAccesses, activeType, loading, className, oper, ...rest } = props;

  const classes = useStyles();
  const rowsPerPage = 7;
  const [page, setPage] = useState(1);

  const [sort, setSort] = useState('desc');
  const handlePageChange = (event, page) => {
    setPage(page);
  };

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
                <TableCell>
                  {oper.length > 0 ? (
                    <TableSortLabel
                      active={activeType === 'user_id'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('user_id');
                      }}>
                      아이디
                    </TableSortLabel>
                  ) : (
                    '아이디'
                  )}
                </TableCell>
                <TableCell>
                  {oper.length > 0 ? (
                    <TableSortLabel
                      active={activeType === 'date'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('date');
                      }}>
                      날짜
                    </TableSortLabel>
                  ) : (
                    '날짜'
                  )}
                </TableCell>
                <TableCell>
                  {oper.length > 0 ? (
                    <TableSortLabel
                      active={activeType === 'action'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('action');
                      }}>
                      동작
                    </TableSortLabel>
                  ) : (
                    '동작'
                  )}
                </TableCell>
                <TableCell>
                  {oper.length > 0 ? (
                    <TableSortLabel
                      active={activeType === 'description'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('description');
                      }}>
                      상세
                    </TableSortLabel>
                  ) : (
                    '상세'
                  )}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/*TO DO : oper에서 중요한 개인정보 나오지 않도록 하기*/}
              {oper
                .slice(
                  (page - 1) * rowsPerPage,
                  (page - 1) * rowsPerPage + rowsPerPage
                )
                .map(oper => {
                  return (
                    <TableRow key={oper._id}>
                      <TableCell>
                        {oper.id === null ? '탈퇴한 회원' : oper.id.user_id}
                      </TableCell>
                      <TableCell>{oper.date}</TableCell>
                      <TableCell>{oper.action}</TableCell>
                      <TableCell>{oper.description}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
      <CardActions className={classes.actions}>
        <Grid container alignItems="center" justify="center">
          <Pagination
            count={
              oper.length % rowsPerPage === 0
                ? parseInt(oper.length / rowsPerPage)
                : parseInt(
                    oper.length / rowsPerPage +
                      parseInt(oper.length % rowsPerPage) /
                        parseInt(oper.length % rowsPerPage)
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

OperTable.propTypes = {
  className: PropTypes.string
};

export default OperTable;
