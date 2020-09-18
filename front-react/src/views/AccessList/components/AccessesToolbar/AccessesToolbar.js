import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import Select from '@material-ui/core/Select';
import { DateRangePicker, IntlProvider } from 'rsuite';
import kor from 'rsuite/lib/IntlProvider/locales/ko_KR';
import 'rsuite/dist/styles/rsuite-default.css';
import MenuItem from '@material-ui/core/MenuItem';
import 'moment/locale/ko';
import TextField from '@material-ui/core/TextField';
import Search from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
// eslint-disable-next-line no-extend-native
Date.prototype.yyyymmdd = function() {
  var yyyy = this.getFullYear().toString();
  var mm = (this.getMonth() + 1).toString();
  var dd = this.getDate().toString();

  return (
    yyyy + '-' + (mm[1] ? mm : '0' + mm[0]) + '-' + (dd[1] ? dd : '0' + dd[0])
  );
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
    width: 100,
    margin: '0 0 0 30px'
  }
}));

const AccessesToolbar = props => {
  const {
    loading,
    accesses,
    search,
    setSearch,
    temp,
    temp_change,
    type,
    type_change,
    typeCange,
    dateChange,
    className,
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
        <IntlProvider locale={kor}>
          <DateRangePicker
            loading={loading}
            cleanable={false}
            showOneCalendar
            defaultValue={[new Date(), new Date()]}
            onChange={val => {
              dateChange([val[0].yyyymmdd(), val[1].yyyymmdd()]);
            }}
          />
        </IntlProvider>
        <Select
          className={classes.select}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={props.type}
          onChange={handleTypeChange}>
          <MenuItem value="0">전체</MenuItem>
          <MenuItem value="1">사원</MenuItem>
          <MenuItem value="2">방문자</MenuItem>
          <MenuItem value="3">미등록자</MenuItem>
          <MenuItem value="4">블랙리스트</MenuItem>
        </Select>
        <Select
          className={classes.select}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={temp}
          onChange={handleTempChange}>
          <MenuItem value="0">전체</MenuItem>
          <MenuItem value="1">정상 온도</MenuItem>
          <MenuItem value="2">비정상 온도</MenuItem>
        </Select>
        <div style={{ width: '100%' }}>
          <TextField
            style={{ float: 'right', marginRight: '30px' }}
            className={classes.search}
            id="input-with-icon-textfield"
            // label="검색"
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
