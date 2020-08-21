import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {TextField,InputAdornment} from '@material-ui/core'
import Search from '@material-ui/icons/Search';
import 'rsuite/dist/styles/rsuite-default.css'

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

const ScreensToolbar = props => {
  const {search,handleSearch,className, ...rest } = props;

  const classes = useStyles();

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <TextField
      className={classes.search}
      id="input-with-icon-textfield"
      value={search}
      onChange={handleSearch}
      placeholder="검색"
      InputProps={{
        endAdornment: (
          <InputAdornment position="end"><Search></Search></InputAdornment>
        ),
      }}
      />
    </div>
  );
};

ScreensToolbar.propTypes = {
  className: PropTypes.string,
};

export default ScreensToolbar;
