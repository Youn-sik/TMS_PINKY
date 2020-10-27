import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Pagination from '@material-ui/lab/Pagination';
import { makeStyles } from '@material-ui/styles';
import { NavLink as RouterLink } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import LinearProgress from '@material-ui/core/LinearProgress';
import Checkbox from '@material-ui/core/Checkbox';
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
  Dialog,
  Paper,
  Button
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

const AccessesTable = props => {
  const {
    tempType,
    tempLimit,
    sortAccesses,
    activeType,
    loading,
    className,
    accesses,
    handleClick,
    isSelected,
    handleSelectAllClick,
    selected,
    page,
    pages,
    sort,
    setSort,
    setPage,
    ...rest
  } = props;

  const [currentUrl,setCurrnetUrl] = useState("");
  const [imageModal,setImageModal] = useState(false)

  const classes = useStyles();

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

  const clickImage = url => {
    setCurrnetUrl(url);
    setImageModal(true);
  }

  const handleClose = () => {
    setImageModal(false);
  }

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={imageModal}>
        <img
        alt="screenShot"
        style={{maxWidth:'50vw'}}
        src={currentUrl}></img>
      </Dialog>
      <CardContent className={classes.content}>
        {loading ? <LinearProgress style={{ width: '100%' }} /> : null}
        <TableContainer component={Paper}>
          <Table className={classes.inner} size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Checkbox
                    checked={
                      selected.length === accesses.length && accesses.length !== 0
                        ? true
                        : false
                    }
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                <TableCell>사진</TableCell>
                <TableCell>
                  {accesses.length > 0 ? (
                    <TableSortLabel
                      active={activeType === 'stb_location'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('stb_location');
                      }}>
                      단말 위치
                    </TableSortLabel>
                  ) : (
                    '단말 위치'
                  )}
                </TableCell>
                <TableCell>
                  {accesses.length > 0 ? (
                    <TableSortLabel
                      active={activeType === 'stb_name'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('stb_name');
                      }}>
                      단말명
                    </TableSortLabel>
                  ) : (
                    '단말명'
                  )}
                </TableCell>
                <TableCell>
                  {accesses.length > 0 ? (
                    <TableSortLabel
                      active={activeType === 'stb_sn'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('stb_sn');
                      }}>
                      시리얼 번호
                    </TableSortLabel>
                  ) : (
                    '시리얼 번호'
                  )}
                </TableCell>
                <TableCell>
                  {accesses.length > 0 ? (
                    <TableSortLabel
                      active={activeType === 'avatar_distance'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('avatar_distance');
                      }}>
                      거리
                    </TableSortLabel>
                  ) : (
                    '거리'
                  )}
                </TableCell>
                <TableCell>
                  {accesses.length > 0 ? (
                    <TableSortLabel
                      active={activeType === 'avatar_temperature'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('avatar_temperature');
                      }}>
                      온도
                    </TableSortLabel>
                  ) : (
                    '온도'
                  )}
                </TableCell>
                <TableCell>
                  {accesses.length > 0 ? (
                    <TableSortLabel
                      active={activeType === 'access_time'}
                      direction={sort}
                      onClick={() => {
                        createSortHandler('access_time');
                      }}>
                      출입시간
                    </TableSortLabel>
                  ) : (
                    '출입시간'
                  )}
                </TableCell>
                {/* <TableCell>사용자 등록</TableCell> */}
              </TableRow>
            </TableHead>
            {
              <TableBody>
                {props.accesses
                  .map((access,index) => {
                    const isItemSelected = isSelected(access._id);
                    if (access.avatar_temperature >= tempLimit) {
                      //출입 기록 37.5도 이상일때
                      return (
                        <TableRow
                          className={classes.highTempRow}
                          key={access._id}>
                          <TableCell>
                            <Checkbox
                              onChange={event => handleClick(event, access, index)}
                              checked={isItemSelected}
                            />
                          </TableCell>
                          <TableCell>
                            <div className={classes.nameContainer}>
                              <img
                                alt="screenShot"
                                height="90px"
                                width="70px"
                                className={classes.hightTempAvatar}
                                src={access.avatar_file_url}></img>
                            </div>
                          </TableCell>
                          <TableCell>
                            {access.stb_location}
                          </TableCell>
                          <TableCell>
                            {access.stb_name}
                          </TableCell>
                          <TableCell>
                            {access.stb_sn}
                          </TableCell>
                          <TableCell className={classes.redFont}>
                            {access.avatar_distance
                              ? String(access.avatar_distance).substr(0, 3)
                              : 0}
                            M
                          </TableCell>
                          <TableCell className={classes.redFont}>
                            {tempType === 1
                              ? String(access.avatar_temperature).substring(
                                  0,
                                  4
                                )
                              : '비정상 체온'}
                          </TableCell>
                          <TableCell className={classes.redFont}>
                            {access.access_time}
                          </TableCell>
                          {/* <TableCell>
                            {
                              access.avatar_type === 3 ? 
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
                                  등록
                                </Button>
                              </RouterLink> : null
                            }
                          </TableCell> */}
                        </TableRow>
                      );
                    } else {
                      return (
                        <TableRow className={classes.tableRow} key={access._id}>
                          <TableCell>
                            <Checkbox
                              onChange={event => handleClick(event, access, index)}
                              checked={isItemSelected}
                            />
                          </TableCell>
                          <TableCell>
                            <div className={classes.nameContainer} style={{cursor: 'pointer'}} onClick={()=>{clickImage(access.avatar_file_url)}}>
                              <img
                                alt="screenShot"
                                height="90px"
                                width="70px"
                                className={classes.avatar}
                                src={access.avatar_file_url}></img>
                            </div>
                          </TableCell>
                          <TableCell>
                            {access.stb_location}
                          </TableCell>
                          <TableCell>
                            {access.stb_name}
                          </TableCell>
                          <TableCell>
                            {access.stb_sn}
                          </TableCell>
                          <TableCell>
                            {access.avatar_distance
                              ? String(access.avatar_distance).substr(0, 3)
                              : 0}
                            M
                          </TableCell>
                          <TableCell>
                            {tempType === 1
                              ? String(access.avatar_temperature).substring(
                                  0,
                                  4
                                )
                              : '정상 체온'}
                          </TableCell>
                          <TableCell>{access.access_time}</TableCell>
                          {/* <TableCell>
                            {
                              access.avatar_type === 3 ? 
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
                                  등록
                                </Button>
                              </RouterLink> : null
                            }
                          </TableCell> */}
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
            count={pages}
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

AccessesTable.propTypes = {
  className: PropTypes.string
};

export default AccessesTable;
