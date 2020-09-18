import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { DateRangePicker, IntlProvider } from 'rsuite';
import TextField from '@material-ui/core/TextField';
import Search from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import kor from 'rsuite/lib/IntlProvider/locales/ko_KR';
import 'rsuite/dist/styles/rsuite-default.css';
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

const ErrorsToolbar = props => {
  const { loading, setSearch, search, dateChange, className, ...rest } = props;

  const classes = useStyles();
  const handleSearch = e => {
    setSearch(e.target.value);
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
        <div style={{ width: '100%' }}>
          <TextField
            className={classes.search}
            style={{ float: 'right', marginRight: '20px' }}
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

ErrorsToolbar.propTypes = {
  className: PropTypes.string,
  dateChange: PropTypes.func
};

export default ErrorsToolbar;
