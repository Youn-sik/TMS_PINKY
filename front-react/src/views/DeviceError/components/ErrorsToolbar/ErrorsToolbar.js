import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {DateRangePicker,IntlProvider} from 'rsuite'
import kor from 'rsuite/lib/IntlProvider/locales/ko_KR';
import 'rsuite/dist/styles/rsuite-default.css'
import 'moment/locale/ko'
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
  }
}));

const ErrorsToolbar = props => {
  const {dateChange,className, ...rest } = props;

  const classes = useStyles();

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <div className={classes.row}>
        <IntlProvider locale={kor}>
          <DateRangePicker 
            cleanable={false}
            showOneCalendar 
            defaultValue={[new Date(), new Date()]}
            onChange={(val) => {dateChange([val[0].yyyymmdd(),val[1].yyyymmdd()])}}
          />
        </IntlProvider>
      </div>
    </div>
  );
};

ErrorsToolbar.propTypes = {
  className: PropTypes.string,
  dateChange: PropTypes.func,
};

export default ErrorsToolbar;
