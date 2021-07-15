import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Pagination from '@material-ui/lab/Pagination';
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
  Paper,
  TableContainer
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

const UsersTable = props => {
  const {
    sortAccesses,
    activeType,
    loading,
    className,
    users,
    ...rest
  } = props;

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
                <TableCell>사진</TableCell>
                <TableCell>
                  {users.length > 0 ? (
                    <TableSortLabel
                      active={activeType === 'name'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('name');
                      }}>
                      이름
                    </TableSortLabel>
                  ) : (
                    '이름'
                  )}
                </TableCell>
                <TableCell>
                  {users.length > 0 ? (
                    <TableSortLabel
                      active={activeType === 'location'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('location');
                      }}>
                      근무지
                    </TableSortLabel>
                  ) : (
                    '근무지'
                  )}
                </TableCell>
                <TableCell>
                  {users.length > 0 ? (
                    <TableSortLabel
                      active={activeType === 'depart'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('depart');
                      }}>
                      부서
                    </TableSortLabel>
                  ) : (
                    '부서'
                  )}
                </TableCell>
                <TableCell>
                  {users.length > 0 ? (
                    <TableSortLabel
                      active={activeType === 'position'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('position');
                      }}>
                      직급
                    </TableSortLabel>
                  ) : (
                    '직급'
                  )}
                </TableCell>
                <TableCell>
                  {users.length > 0 ? (
                    <TableSortLabel
                      active={activeType === 'att'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('att');
                      }}>
                      출근
                    </TableSortLabel>
                  ) : (
                    '출근'
                  )}
                </TableCell>
                <TableCell>
                  {users.length > 0 ? (
                    <TableSortLabel
                      active={activeType === 'late'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('late');
                      }}>
                      지각
                    </TableSortLabel>
                  ) : (
                    '지각'
                  )}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.users
                .slice(
                  (page - 1) * rowsPerPage,
                  (page - 1) * rowsPerPage + rowsPerPage
                )
                .map(user => {
                  return (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className={classes.nameContainer}>
                          <img
                            alt="프로필사진"
                            height="90px"
                            width="70px"
                            src={user.avatar_file_url}></img>
                        </div>
                      </TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.location}</TableCell>
                      <TableCell>{user.department_id}</TableCell>
                      <TableCell>{user.position}</TableCell>
                      <TableCell>{user.attendance}</TableCell>
                      <TableCell>{user.late}</TableCell>
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
              props.users.length % rowsPerPage === 0
                ? parseInt(props.users.length / rowsPerPage)
                : parseInt(
                    props.users.length / rowsPerPage +
                      parseInt(props.users.length % rowsPerPage) /
                        parseInt(props.users.length % rowsPerPage)
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
