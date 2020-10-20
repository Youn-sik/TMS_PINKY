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
          <InputGroup style={{ width: 460 }}>
          <IntlProvider locale={kor}>
            <DatePicker 
            format="YYYY-MM-DD HH:mm:ss" 
            block 
            loading={loading}
            cleanable={false}
            onChange={val => {
              dateChange([val.yyyymmddhhmmss(), 0]);
            }}
            value={new Date(date[0])}
            defaultValue={new Date(`${moment().format('YYYY-MM-DD')}T00:00:00`)} />
            <InputGroup.Addon>~</InputGroup.Addon>
            <DatePicker 
            format="YYYY-MM-DD HH:mm:ss" 
            block 
            loading={loading}
            cleanable={false}
            onChange={val => {
              dateChange([0, val.yyyymmddhhmmss()]);
            }}
            value={new Date(date[1])}
            defaultValue={new Date(`${moment().format('YYYY-MM-DD')}T23:59:59`)}/>
            
            </IntlProvider>
          </InputGroup>
          <Select
            className={classes.select}
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
          <Select
            className={classes.select}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={temp}
            style={{}}
            onChange={handleTempChange}>
            <MenuItem value="0">전체</MenuItem>
            <MenuItem value="1">정상 온도</MenuItem>
            <MenuItem value="2">비정상 온도</MenuItem>
          </Select>
          <Select
            className={classes.select}
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
          <Button 
          style={{width:'200px', marginLeft:'10px',marginRight:'10px' }} 
          variant="contained" color="primary" onClick={clickExport}>
            엑셀로 다운로드
          </Button>
          <Button 
          style={{marginLeft:'10px' }} 
          variant="contained" color="secondary" onClick={deleteAccesses}>
            삭제
          </Button>
          <br/>
        <div style={{ width: '50%' }}>
          <TextField
            style={{ float: 'right', marginRight: '30px' }}
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
            <MenuItem value={'stb_name'}>단말기명</MenuItem>
            <MenuItem value={'stb_location'}>단말기 위치</MenuItem>
            <MenuItem value={'stb_sn'}>시리얼 번호</MenuItem>
          </Select>
          <Button 
          style={{float: 'right',marginRight: '20px'}} 
          variant="contained" color="primary" onClick={resetSearch}>
            검색 초기화
          </Button>
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
