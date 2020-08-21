import React,{useEffect} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {DateRangePicker,IntlProvider} from 'rsuite'
import kor from 'rsuite/lib/IntlProvider/locales/ko_KR';
// import { SearchInput } from 'components';
import { Grid } from '@material-ui/core';
import 'moment/locale/ko'
import TextField from '@material-ui/core/TextField';
import Search from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
// eslint-disable-next-line no-extend-native
Date.prototype.yyyymmdd = function()
{
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString();
    var dd = this.getDate().toString();
 
    return yyyy +'-'+ (mm[1] ? mm : '0'+mm[0]) +'-'+ (dd[1] ? dd : '0'+dd[0]);
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
    width:100,
    margin:"0 0 0 30px"
  },
  textfield: {
    width:"50%",
  },
  search:{
    margin:'0 20px 0 0'
  }
}));

const UsersToolbar = props => {
  const {search_event,search_val,dateChange,className, ...rest } = props;

  const classes = useStyles();

  useEffect(() => {
    
  },[])

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <div className={classes.row}>
        <Grid container justify="flex-start">
          <IntlProvider locale={kor}>
            <DateRangePicker 
              cleanable={false}
              showOneCalendar 
              defaultValue={[new Date(), new Date()]}
              onChange={(val) => {dateChange([val[0].yyyymmdd(),val[1].yyyymmdd()])}}
            />
          </IntlProvider>
        </Grid>
        <Grid container justify="flex-end">
          <TextField
          className={classes.search}
          id="input-with-icon-textfield"
          // label="검색"
          value={search_val}
          onChange={search_event}
          placeholder="검색"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end"><Search></Search></InputAdornment>
            ),
          }}
          />
        </Grid>
      </div>
    </div>
  );
};

UsersToolbar.propTypes = {
  className: PropTypes.string,
  dateChange: PropTypes.func,
  search_event: PropTypes.func,
  search_val: PropTypes.string
};

export default UsersToolbar;
