import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import axios from 'axios';
import Pagination from '@material-ui/lab/Pagination';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import moment from 'moment';
import 'moment/locale/ko';
import {
  Card,
  CardActions,
  DialogActions,
  Dialog,
  LinearProgress,
  Button,
  CircularProgress
} from '@material-ui/core';
import {base_url as in_base_url,out_base_url} from 'server.json';

let currentUrl = window.location.href
let base_url = in_base_url
// console.log(currentUrl.indexOf("172.16.41.114"))
if(currentUrl.indexOf("172.16.41.114") <= -1) {
  base_url = out_base_url
}

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
  },
  tableRow: {
    display: 'inline-block',
    width: '20%',
    textAlign: 'center'
  }
}));

const ScreensTable = props => {
  const { loading, className, screens, ...rest } = props;

  const classes = useStyles();

  const rowsPerPage = 6;
  const [page, setPage] = useState(1);
  const detailRowsPerPage = 6;
  const [detailPage, setDetailPage] = useState(1);
  const [modalScreens, setModalScreens] = useState([]);
  const [open, setOpen] = useState(false);
  const [dialogLoding, setDialogLoding] = useState(true);
  const [nowDevice, setNowDevice] = useState();

  const handleClose = () => {
    setOpen(false);
    setDialogLoding(true);
  };

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const handleDetailPageChange = (event, page) => {
    setDetailPage(page);
  };

  const clickImage = async device => {
    setModalScreens([]);
    setOpen(true);
    let result = await axios.get(
      base_url + '/camera_monitor?id=' + device._id.camera_obids
    );
    setDialogLoding(false);
    if(result && result.data.length > 0){
      setModalScreens(result.data);
      setNowDevice(device._id.camera_obids);
    }
  };

  const deleteOldPic = async () => {
    if (
      window.confirm(
        '?????? ????????? ????????? ??? ????????? ?????? ????????? \n?????? ???????????????????'
      )
    ) {
      let old = modalScreens.filter(
        screen =>
          screen.regdate.split(' ')[0] <
          moment()
            .subtract(7, 'days')
            .format('YYYY-MM-DD')
      );
      let list = old.map(screen => screen._id);
      // console.log(list);
      await axios.delete(base_url + '/camera_monitor/' + list[0]._id, {
        data: {
          list: list,
          data: old
        }
      });
      clickImage(nowDevice);
      props.getScreens();
      alert('?????? ???????????????');
    }
  };

  const deleteAll = async () => {
    if (
      window.confirm('?????? ????????? ?????? ????????? ?????? ????????? \n?????? ???????????????????')
    ) {
      let list = modalScreens.map(screen => screen._id);
      // console.log(list);
      await axios.delete(base_url + '/camera_monitor/' + list[0]._id, {
        data: {
          list: list,
          data: modalScreens
        }
      });
      clickImage(nowDevice);
      props.getScreens();
      alert('?????? ???????????????');
    }
  };

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      {loading ? <LinearProgress /> : null}
      <Grid container spacing={4}>
        {screens
          .slice(
            (page - 1) * rowsPerPage,
            (page - 1) * rowsPerPage + rowsPerPage
          )
          .map(screen => (
            <Grid item lg={4} sm={6} xl={4} xs={12} key={screen._id}>
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <img
                  src={screen.upload_url}
                  alt="????????????"
                  onError={e => {
                    e.target.src = base_url + '/image/noImage.svg';
                  }}
                  style={{
                    maxWidth: '250px',
                    maxHeight: 'auto',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    clickImage(screen);
                  }}
                />
                <p
                  style={{
                    margin: '0 auto',
                    position: 'relative',
                    minWidth: '250px',
                    maxWidth: '250px',
                    bottom: '38px',
                    backgroundColor: ' rgba( 0, 0, 0, 0.5 )',
                    color: '#dddddd',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    clickImage(screen);
                  }}>
                  {screen._id.serial_number}
                  <br />
                  {screen.lastDate}
                </p>
              </div>
            </Grid>
          ))}
      </Grid>
      <CardActions className={classes.actions}>
        <Grid container alignItems="center" justify="center">
          <Pagination
            count={
              screens.length % rowsPerPage === 0
                ? parseInt(screens.length / rowsPerPage)
                : parseInt(
                    screens.length / rowsPerPage +
                      parseInt(screens.length % rowsPerPage) /
                        parseInt(screens.length % rowsPerPage)
                  )
            }
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
        // maxWidth={'xl'}
        scroll={'body'}>
        <div style={{ margin: '10px 10px' }}>
          <Button
            style={{ margin: '0px 10px' }}
            variant="contained"
            onClick={deleteOldPic}
            color="primary">
            ????????? ?????? ??????
          </Button>
          <Button variant="contained" onClick={deleteAll} color="secondary">
            ?????? ??????
          </Button>
        </div>
        {dialogLoding ? <CircularProgress style={{ margin: 100 }} /> : null}
        <Card>
          <Grid container justify="center" alignItems="center">
            {modalScreens
              .slice(
                (detailPage - 1) * detailRowsPerPage,
                (detailPage - 1) * detailRowsPerPage + detailRowsPerPage
              )
              .map(screen => (
                <Grid item lg={6} sm={6} xl={6} xs={12} ket={screen._id}>
                  <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <img
                      src={screen.upload_url}
                      alt=""
                      onError={e => {
                        e.target.src = base_url + '/image/noImage.svg';
                      }}
                      style={{ width: '250px', height: 'auto' }}
                    />
                    <p
                      style={{
                        margin: '0 auto',
                        position: 'relative',
                        minWidth: '250px',
                        maxWidth: '250px',
                        bottom: '38px',
                        backgroundColor: ' rgba( 0, 0, 0, 0.5 )',
                        color: '#dddddd',
                        cursor: 'pointer'
                      }}>
                      {screen.serial_number}
                      <br />
                      {screen.regdate}
                    </p>
                  </div>
                </Grid>
              ))}
          </Grid>
          <Grid container alignItems="center" justify="center">
            <Pagination
              count={parseInt(
                modalScreens.length / detailRowsPerPage +
                  parseInt(modalScreens.length % detailRowsPerPage) /
                    parseInt(modalScreens.length % detailRowsPerPage)
              )}
              onChange={handleDetailPageChange}
              page={detailPage}
              size="small"
              variant="outlined"
              shape="rounded"
            />
          </Grid>
        </Card>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            ??????
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

ScreensTable.propTypes = {
  className: PropTypes.string,
  accesses: PropTypes.array
};

export default ScreensTable;
