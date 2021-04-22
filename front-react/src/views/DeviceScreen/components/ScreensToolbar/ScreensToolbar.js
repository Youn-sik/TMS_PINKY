import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { TextField, InputAdornment, Button } from '@material-ui/core';
import Search from '@material-ui/icons/Search';
import moment from 'moment';
import 'moment/locale/ko';
import 'rsuite/dist/styles/rsuite-default.css';
import {base_url as in_base_url,out_base_url} from 'server.json';

let currentUrl = window.location.href
let base_url = in_base_url
console.log(currentUrl.indexOf("172.16.33.130"))
if(currentUrl.indexOf("172.16.33.130") <= -1) {
  base_url = out_base_url
}

const useStyles = makeStyles(theme => ({
  root: {},
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1)
  },
  spacer: {
    flexGrow: 1
  },
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  },
  searchInput: {
    marginRight: theme.spacing(1)
  },
  select: {
    width: 100,
    margin: '0 0 0 30px'
  }
}));

const ScreensToolbar = props => {
  const { search, handleSearch, className, ...rest } = props;
  const [data, setData] = useState([]);
  const classes = useStyles();

  const getPictures = async () => {
    let result = await axios.get(base_url + '/camera_monitor');
    if(result && result.data.length > 0) {
      setData(result.data);
    }
  };

  const deleteOldPic = async () => {
    if (
      window.confirm(
        '현재 단말의 일주일 전 파일을 삭제 합니다 \n삭제 하시겠습니다?'
      )
    ) {
      let old = data.filter(
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
      props.getScreens();
      alert('삭제 되었습니다');
    }
  };

  const deleteAll = async () => {
    if (
      window.confirm('현재 단말의 모든 파일을 삭제 합니다 \n삭제 하시겠습니다?')
    ) {
      let list = data.map(screen => screen._id);
      // console.log(list);
      await axios.delete(base_url + '/camera_monitor/' + list[0]._id, {
        data: {
          list: list,
          data: data
        }
      });
      props.getScreens();
      alert('삭제 되었습니다');
    }
  };

  useEffect(() => {
    getPictures();
  }, []);

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <TextField
        className={classes.search}
        id="input-with-icon-textfield"
        value={search}
        onChange={handleSearch}
        placeholder="검색"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search></Search>
            </InputAdornment>
          )
        }}
      />
      <Button
        style={{ margin: '0px 10px', float: 'right' }}
        disabled={props.screens.length === 0}
        variant="contained"
        onClick={deleteOldPic}
        color="primary">
        오래된 사진 삭제
      </Button>
      <Button
        style={{ float: 'right' }}
        variant="contained"
        disabled={props.screens.length === 0}
        onClick={deleteAll}
        color="secondary">
        전체 삭제
      </Button>
    </div>
  );
};

ScreensToolbar.propTypes = {
  className: PropTypes.string
};

export default ScreensToolbar;
