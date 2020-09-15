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

const AccessesTable = props => {
  const {tempType,tempLimit,sortAccesses,activeType, loading,className,accesses, ...rest } = props;

  const classes = useStyles();

  const rowsPerPage = 7;
  const [page, setPage] = useState(1);
  
  const [sort, setSort] = useState('desc')

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const createSortHandler = (headerType) => {
    if(sort === 'desc'){
      setSort('asc')
      sortAccesses('asc',headerType)
    }
    else{
      setSort('desc')
      sortAccesses('desc',headerType)
    }
  }

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent className={classes.content}>
        {loading ? <LinearProgress style={{width:"100%"}}/> : null}
        <TableContainer component={Paper}>
            <Table className={classes.inner} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>사진</TableCell>
                  <TableCell>
                    {
                      accesses.length > 0 ? 
                      <TableSortLabel
                      active={activeType === 'name'}
                      direction={sort}
                      onClick={() => {createSortHandler('name')}}
                      >
                        이름
                      </TableSortLabel> : "이름"
                    }
                  </TableCell>
                  <TableCell>
                    {
                      accesses.length > 0 ? 
                      <TableSortLabel
                      active={activeType === 'type'}
                      direction={sort}
                      onClick={() => {createSortHandler('type')}}
                      >
                        타입
                      </TableSortLabel> : "타입"
                    }
                  </TableCell>
                  <TableCell>
                    {
                      accesses.length > 0 ? 
                      <TableSortLabel
                      active={activeType === 'distance'}
                      direction={sort}
                      onClick={() => {createSortHandler('distance')}}
                      >
                        거리
                      </TableSortLabel> : "거리"
                    }
                  </TableCell>
                  <TableCell>
                    {
                      accesses.length > 0 ? 
                      <TableSortLabel
                      active={activeType === 'temp'}
                      direction={sort}
                      onClick={() => {createSortHandler('temp')}}
                      >
                        온도
                      </TableSortLabel> : "온도"
                    }
                  </TableCell>
                  <TableCell>
                    {
                      accesses.length > 0 ? 
                      <TableSortLabel
                      active={activeType === 'time'}
                      direction={sort}
                      onClick={() => {createSortHandler('time')}}
                      >
                        출입시간
                      </TableSortLabel> : "출입시간"
                    }
                  </TableCell>
                </TableRow>
              </TableHead>
              {
                <TableBody>
                  {props.accesses.slice((page-1) * rowsPerPage, (page-1) * rowsPerPage + rowsPerPage).map(access => {
                    if(access.avatar_temperature >= tempLimit){ //출입 기록 37.5도 이상일때
                      return(
                        <TableRow
                          className={classes.highTempRow}
                          key={access._id}
                        >
                          <TableCell>
                            <div className={classes.nameContainer}>
                              <img
                                alt="screenShot"
                                height="90px"
                                width="70px"
                                className={classes.hightTempAvatar}
                                src={access.avatar_file_url}
                              >
                              </img>
                            </div>
                          </TableCell>
                          <TableCell>{access.name === 'unknown' ? null : access.name}</TableCell>
                          <TableCell className={classes.redFont}>{access.avatar_type === 1 ? "사원" :
                                      access.avatar_type === 2 ? "방문자" : 
                                      access.avatar_type === 4 ? '블랙리스트' : '미등록자'}</TableCell>
                          <TableCell className={classes.redFont}>{access.avatar_distance ? String(access.avatar_distance).substr(0,3) : 0}M</TableCell>
                          <TableCell className={classes.redFont}>{tempType === 1 ? String(access.avatar_temperature).substring(0,4) : "비정상 체온"}</TableCell>
                          <TableCell className={classes.redFont}>{access.access_time}</TableCell>
                        </TableRow>
                      )
                    } else {
                      return(
                        <TableRow
                          className={classes.tableRow}
                          key={access._id}
                        >
                          <TableCell>
                            <div className={classes.nameContainer}>
                              <img
                                alt="screenShot"
                                height="90px"
                                width="70px"
                                className={classes.avatar}
                                src={access.avatar_file_url}
                              >
                              </img>
                            </div>
                          </TableCell>
                          <TableCell>{access.name === 'unknown' ? null : access.name}</TableCell>
                          <TableCell>{access.avatar_type === 1 ? "사원" :
                                      access.avatar_type === 2 ? "방문자" : 
                                      access.avatar_type === 4 ? '블랙리스트' : '미등록자'}</TableCell>
                          <TableCell>{access.avatar_distance ? String(access.avatar_distance).substr(0,3) : 0}M</TableCell>
                          <TableCell>{tempType === 1 ? String(access.avatar_temperature).substring(0,4) : "정상 체온"}</TableCell>
                          <TableCell>{access.access_time}</TableCell>
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

AccessesTable.propTypes = {
  className: PropTypes.string,
};



export default AccessesTable;
