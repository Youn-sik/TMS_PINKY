import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import { DateRangePicker, IntlProvider,InputGroup,DatePicker} from 'rsuite';
import kor from 'rsuite/lib/IntlProvider/locales/ko_KR';
import 'rsuite/dist/styles/rsuite-default.css';
import MenuItem from '@material-ui/core/MenuItem';
import moment from 'moment';
import 'moment/locale/ko';
import TextField from '@material-ui/core/TextField';
import Search from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
// eslint-disable-next-line no-extend-native
Date.prototype.yyyymmdd = function() {
  var yyyy = this.getFullYear().toString();
  var mm = (this.getMonth() + 1).toString();
  var dd = this.getDate().toString();
  var hh = (this.getHours() + 12).toString();
  return (
    yyyy + '-' + (mm[1] ? mm : '0' + mm[0]) + '-' + (dd[1] ? dd : '0' + dd[0])
  );
};

Date.prototype.hhmmss = function() {
  var hh = this.getHours();
  var mm = this.getMinutes();
  var ss = this.getSeconds();

  return [(hh>9 ? '' : '0') + hh + ":",
          (mm>9 ? '' : '0') + mm + ":",
          (ss>9 ? '' : '0') + ss,
        ].join('');
};

Date.prototype.yyyymmddhhmmss = function() {
  return this.yyyymmdd() + " " +this.hhmmss();
};

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
    // width: 100,
    margin: '0 0 0 30px',
  }
}));

const AccessesToolbar = props => {
  const {
    loading,
    accesses,
    search,
    setSearch,
    temp,
    handleSearchType,
    handleRowsPerPage,
    rowsPerPage,
    temp_change,
    deleteAccesses,
    type,
    type_change,
    resetSearch,
    date,
    typeCange,
    deleteAllAccesses,
    searchType,
    dateChange,
    deleteRecords,
    className,
    clickSearch,
    clickExport,
    ...rest
  } = props;

  const handleTypeChange = event => {
    // setType(event.target.value);
    type_change(event.target.value);
  };

  const handleTempChange = event => {
    // setTemp(event.target.value);
    temp_change(event.target.value);
  };

  const classes = useStyles();

  const handleSearch = e => {
    setSearch(e);
  };

  const locale = {
    sunday: '일',
    monday: '월',
    tuesday: '화',
    wednesday: '수',
    thursday: '목',
    friday: '금',
    saturday: '토',
    ok: '적용',
    today: '오늘',
    yesterday: '어제',
    hours: '시간',
    minutes: '분',
    seconds: '초',
    last7Days: '일주일전'
  }

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <div className={classes.row}>
        {/* <IntlProvider locale={kor}>
          <DateRangePicker
            loading={loading}
            cleanable={false}
            showOneCalendar
            defaultValue={[new Date(), new Date()]}
            onChange={val => {
              dateChange([val[0].yyyymmdd(), val[1].yyyymmdd()]);
            }}
          />
        </IntlProvider> */}
          <InputGroup style={{ width: 400 }}>
          <IntlProvider locale={kor}>
            <DatePicker 
            format="YYYY-MM-DD HH:mm:ss" 
            block 
            loading={loading}
            cleanable={false}
            onChange={val => {
              if(val.yyyymmddhhmmss() > date[1]){
                alert('날짜 범위가 잘못되었습니다\n다시 설정해 주세요.')
              } else {
                dateChange([val.yyyymmddhhmmss(), 0]);
              }
            }}
            locale={locale}
            value={new Date(date[0])}
            defaultValue={new Date(`${moment().format('YYYY-MM-DD')}T00:00:00`)} />
            <InputGroup.Addon>~</InputGroup.Addon>
            <DatePicker 
            format="YYYY-MM-DD HH:mm:ss" 
            block 
            loading={loading}
            cleanable={false}
            onChange={val => {
              if(val.yyyymmddhhmmss() < date[0]){
                alert('날짜 범위가 잘못되었습니다\n다시 설정해 주세요.')
              } else {
                dateChange([0, val.yyyymmddhhmmss()]);
              }
            }}
            locale={locale}
            value={new Date(date[1])}
            defaultValue={new Date(`${moment().format('YYYY-MM-DD')}T23:59:59`)}/>
            </IntlProvider>
          </InputGroup>
            <FormControl
              className={classes.select}>
            <InputLabel id="demo-simple-select-label">온도</InputLabel>
            <Select
              style={{ width: '50px',marginBottom:'11px'}}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={type}
              onChange={handleTypeChange}>
              <MenuItem value=" ">전체</MenuItem>
              <MenuItem value="34">34</MenuItem>
              <MenuItem value="35">35</MenuItem>
              <MenuItem value="36">36</MenuItem>
              <MenuItem value="37">37</MenuItem>
              <MenuItem value="38">38</MenuItem>
              <MenuItem value="39">39</MenuItem>
            </Select>
          </FormControl>
          <FormControl
              className={classes.select}>
          <InputLabel id="demo-simple-select-label">온도 상태</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={temp}
            style={{ width: '95px',marginBottom:'11px'}}
            onChange={handleTempChange}>
            <MenuItem value="0">전체</MenuItem>
            <MenuItem value="1">정상 온도</MenuItem>
            <MenuItem value="2">비정상 온도</MenuItem>
          </Select>
          </FormControl>
          <FormControl
              className={classes.select}>
          <InputLabel id="demo-simple-select-label">리스트</InputLabel>
          <Select
            style={{width:'50px',marginBottom:'11px'}}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={rowsPerPage}
            onChange={handleRowsPerPage}
            >
            <MenuItem value="7">7</MenuItem>
            <MenuItem value="10">10</MenuItem>
            <MenuItem value="30">30</MenuItem>
            <MenuItem value="50">50</MenuItem>
            <MenuItem value="100">100</MenuItem>
          </Select>
          </FormControl>
          <Button
          disabled={props.selected.length === 0 ? true : false}
          style={{marginLeft:'10px' }} 
          variant="contained" color="secondary" onClick={deleteAccesses}>
            삭제
          </Button>
          {/* <Button 
          style={{marginLeft:'10px' }} 
          variant="contained" color="secondary" onClick={deleteAllAccesses}>
            전체 삭제
          </Button> */}
          <br/>
        <div style={{ float:'right',width: '50%' }}>
          <Button 
            style={{float: 'right',marginLeft: '10px'}} 
            variant="contained" color="secondary" onClick={resetSearch}>
              검색 초기화
          </Button>
          <Button 
          style={{float: 'right' }} 
          variant="contained" color="primary" onClick={clickExport}>
            엑셀로 다운로드
          </Button>
          <TextField
            style={{ float: 'right', marginRight: '10px' }}
            className={classes.search}
            id="input-with-icon-textfield"
            // label="검색"
            value={search}
            onKeyUp={()=>{if(window.event.keyCode === 13) clickSearch();}}
            onChange={handleSearch}
            placeholder="검색"
            InputProps={{
              endAdornment: (
                <InputAdornment style={{cursor:'pointer'}} onClick={clickSearch} position="end">
                  <Search></Search>
                </InputAdornment>
              )
            }}
          />
          <Select
            style={{ float: 'right',marginRight: '20px',width:"100px" }}
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={searchType}
            onChange={handleSearchType}
          >
            <MenuItem value={'stb_name'}>단말명</MenuItem>
            <MenuItem value={'stb_location'}>단말 위치</MenuItem>
            <MenuItem value={'stb_sn'}>시리얼 번호</MenuItem>
          </Select>
        </div>
      </div>
    </div>
  );
};

AccessesToolbar.propTypes = {
  className: PropTypes.string,
  dateChange: PropTypes.func,
  type_change: PropTypes.func,
  type: PropTypes.string,
  temp_change: PropTypes.func,
  temp: PropTypes.string
};

export default AccessesToolbar;
