import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import Select from '@material-ui/core/Select';
import { DateRangePicker, IntlProvider } from 'rsuite';
import kor from 'rsuite/lib/IntlProvider/locales/ko_KR';
import 'rsuite/dist/styles/rsuite-default.css';
import MenuItem from '@material-ui/core/MenuItem';
import 'moment/locale/ko';
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

const UsersToolbar = props => {
  const { loading, temp, temp_change, dateChange, className, ...rest } = props;

  const handleTempChange = event => {
    // setTemp(event.target.value);
    temp_change(event.target.value);
  };

  const classes = useStyles();

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
    last7Days: '일주일전',
    last7Days: '일주일전'
  }

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <div className={classes.row}>
        <IntlProvider locale={kor}>
          <DateRangePicker
            locale={locale}
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
          value={temp}
          onChange={handleTempChange}>
          <MenuItem value="0">전체</MenuItem>
          <MenuItem value="1">정상 온도</MenuItem>
          <MenuItem value="2">비정상 온도</MenuItem>
        </Select>
      </div>
    </div>
  );
};

UsersToolbar.propTypes = {
  className: PropTypes.string,
  dateChange: PropTypes.func,
  temp_change: PropTypes.func,
  temp: PropTypes.string
};

export default UsersToolbar;
