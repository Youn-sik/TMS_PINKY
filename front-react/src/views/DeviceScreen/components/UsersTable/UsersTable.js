import React, { useState,useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import axios from 'axios';
import Pagination from '@material-ui/lab/Pagination';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import {
  Card,
  CardActions,
  DialogActions,
  DialogContent,
  Dialog,
  LinearProgress,
  Button,
  CircularProgress,
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
  tableRow: {
    display:'inline-block', 
    width:'20%', 
    textAlign:'center',
  }
}));

const UsersTable = props => {
  const { loading,className,accesses, ...rest } = props;

  const classes = useStyles();

  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [page, setPage] = useState(1);
  const [detailRowsPerPage, setDetailRowsPerPage] = useState(6);
  const [detailPage, setDetailPage] = useState(1);
  const [clickedDevice,setClickedDevice] = useState("")
  const [modalScreens,setModalScreens] = useState([])
  const [open, setOpen] = useState(false);
  const [dialogLoding,setDialogLoding] = useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDialogLoding(true)
  };

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const handleDetailPageChange = (event, page) => {
    setDetailPage(page);
  };

  const clickImage = async (device) => {
    setModalScreens([])
    setOpen(true);
    let result = await axios.get("http://172.16.135.89:3000/camera_monitor?id="+device._id.camera_obids)
    setModalScreens(result.data)
    setDialogLoding(false);
  }

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      {loading ? <LinearProgress /> : null}
      <Grid container spacing={4}>
        {accesses.slice((page-1) * rowsPerPage, (page-1) * rowsPerPage + rowsPerPage).map(access => (
          <Grid 
          item
          lg={4}
          sm={6}
          xl={4}
          xs={12}
          >
            <div style={{ textAlign: 'center',marginTop:"20px"}}>
              <img 
              src={access.upload_url} 
              alt="" 
              onerror='http://172.16.135.89:3000/image/noImage.png' 
              style={{maxWidth:"250px", maxHeight:"200px",cursor:"pointer",boxShadow:"2px 2px 2px 2px gray"}}
              onClick={() => {clickImage(access)}}
              />
              <p 
              style={{margin:"0 auto",position:'relative',minWidth:"250px",maxWidth:"250px", bottom:'38px', backgroundColor:' rgba( 0, 0, 0, 0.5 )', color: '#dddddd', cursor:'pointer'}} 
              onClick={() => {clickImage(access)}}
              >
                  {access._id.serial_number}<br/>
                  {access.lastDate}
              </p>
            </div>
          </Grid>
        ))}
      </Grid>
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

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={'lg'}
        scroll={'body'}
      >
      {dialogLoding ? <CircularProgress style={{margin:100}}/> : null}
        <Card>
          <Grid container spacing={4}>
            {modalScreens.slice((detailPage-1) * detailRowsPerPage, (detailPage-1) * detailRowsPerPage + detailRowsPerPage).map(access => (
              <Grid 
              item
              lg={4}
              sm={6}
              xl={4}
              xs={12}
              >
                <div style={{ textAlign: 'center',marginTop:"20px"}}>
                  <img 
                  src={access.upload_url} 
                  alt="" 
                  onerror='http://172.16.135.89:3000/image/noImage.png' 
                  style={{maxWidth:"250px", maxHeight:"200px",cursor:"pointer",boxShadow:"2px 2px 2px 2px gray"}}
                  />
                  <p 
                  style={{margin:"0 auto",position:'relative',minWidth:"250px",maxWidth:"250px", bottom:'38px', backgroundColor:' rgba( 0, 0, 0, 0.5 )', color: '#dddddd', cursor:'pointer'}} 
                  >
                      {access.serial_number}<br/>
                      {access.create_dt}
                  </p>
                </div>
              </Grid>
            ))}
          </Grid>
          <Grid
          container
          alignItems="center"
          justify="center"
          >
            <Pagination
              count={parseInt(modalScreens.length/detailRowsPerPage+(parseInt(modalScreens.length%detailRowsPerPage)/parseInt(modalScreens.length%detailRowsPerPage)))}
              onChange={handleDetailPageChange}
              page={detailPage}
              variant="outlined" 
              shape="rounded"
            />
          </Grid>
        </Card>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            닫기
          </Button>
        </DialogActions>
      </Dialog>

    </Card>
  );
};

UsersTable.propTypes = {
  className: PropTypes.string,
  accesses : PropTypes.array
};



export default UsersTable;
