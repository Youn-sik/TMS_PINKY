import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper
} from '@material-ui/core';
import TextRotateVertical from '@material-ui/icons/TextRotateVertical'
import Pagination from '@material-ui/lab/Pagination';

const useStyles = makeStyles(() => ({
  root: {
    height: '50%'
  },
  content: {
    padding: 0
  },
  image: {
    height: 60.5,
    width: 48
  },
  actions: {
    justifyContent: 'flex-end'
  },
  cardStyle: {
    height:"360px"
  },
  temp:{
    width:"15px"
  },
  highTempRow:{
    borderLeft:'3px solid red',
    background : 'rgba(255, 204, 204, 0.575)',
  },
  redFont:{
    color:'red'
  },
}));

const Access = props => {
  const {activeType, sortAccesses, clickedNode,className, ...rest } = props;

  const classes = useStyles();

  const [rowsPerPage, setRowsPerPage] = useState(3);
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

  useEffect(() => {
    setSort('desc')
  },[clickedNode])

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className),classes.cardStyle}
    >
      <CardHeader
        title="출입 기록"
      />
      <Divider />
      <CardContent className={classes.content}>
        {/* <List>
          {Object.keys(clickedNode).length ?
          null:<div style={{textAlign: 'center'}}>그룹에서 사용자를 선택해주세요.</div>}
          {props.temp.slice((page-1) * rowsPerPage, (page-1) * rowsPerPage + rowsPerPage).map((people, i) => (
            <ListItem
              divider={i < props.temp.length - 1}
              key={people._id}
            >
              <ListItemAvatar>
                <img
                  alt="Product"
                  className={classes.image}
                  src={people.avatar_file_url}
                />
              </ListItemAvatar>
              <ListItemText
                primary={people.avatar_type === 1 ? "사원" :
                        people.avatar_type === 2 ? '방문자' :
                        people.avatar_type === 3 ? '미등록자' : '블랙리스트'}
                secondary={`${people.access_time} 출입`}
              />
              <div>
                {`${String(people.avatar_temperature).substring(0,4)}℃`}
              </div>
            </ListItem>
          ))}
        </List> */}
        <TableContainer component={Paper}>
            <Table className={classes.inner} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>사진</TableCell>
                  <TableCell>이름</TableCell>
                  <TableCell>타입</TableCell>
                  <TableCell>거리</TableCell>
                  <TableCell>
                    {
                      props.temp.length > 0 ? 
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
                      props.temp.length > 0 ? 
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
                  {props.temp.slice((page-1) * rowsPerPage, (page-1) * rowsPerPage + rowsPerPage).map(access => {
                    if(access.avatar_temperature >= 37.5){ //출입 기록 37.5도 이상일때
                      return(
                        <TableRow
                          className={classes.highTempRow}
                          key={access._id}
                        >
                          <TableCell>
                            <div className={classes.nameContainer}>
                              <img
                                alt="screenShot"
                                height="60px"
                                width="40px"
                                className={classes.hightTempAvatar}
                                src={access.avatar_file_url}
                              >
                              </img>
                            </div>
                          </TableCell>
                          <TableCell className={classes.redFont}>{access.name === 'unknown' ? null : access.name}</TableCell>
                          <TableCell className={classes.redFont}>{access.avatar_type === 1 ? "사원" :
                                      access.avatar_type === 2 ? "방문자" : 
                                      access.avatar_type === 4 ? '블랙리스트' : '미등록자'}</TableCell>
                          <TableCell className={classes.redFont}>{access.avatar_distance ? String(access.avatar_distance).substr(0,3) : 0}M</TableCell>
                          <TableCell className={classes.redFont}>{String(access.avatar_temperature).substring(0,4)}</TableCell>
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
                                height="60px"
                                width="40px"
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
                          <TableCell>{String(access.avatar_temperature).substring(0,4)}</TableCell>
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
          count={ props.temp.length%rowsPerPage === 0 ? parseInt(props.temp.length/rowsPerPage) :
            parseInt(props.temp.length/rowsPerPage+(parseInt(props.temp.length%rowsPerPage)/parseInt(props.temp.length%rowsPerPage)))}
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

export default Access;
