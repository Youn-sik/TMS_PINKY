import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import { ScreensToolbar, ScreensTable } from './components';
import Card from '@material-ui/core/Card';
import 'moment/locale/ko';
import {base_url} from 'server.json';
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  },
  cardcontent: {
    padding: 0,
    '&:last-child': {
      paddingBottom: 0
    }
  },
  toolbar: {
    padding: '20px 0px 10px 20px'
  }
}));

const DeviceScreen = () => {
  const [screens, setScreens] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const handleSearch = e => {
    setSearch(e.target.value);
    let temp = screens.filter(
      i => i._id.serial_number.indexOf(e.target.value) > -1
    );
    if (e.target.value === '') {
      setFiltered([]);
    } else {
      setFiltered(temp);
    }
  };

  useEffect(() => {
    getScreens();
  }, []);

  const classes = useStyles();

  async function getScreens() {
    let result = await axios.get(base_url + '/camera_monitor?id=one_device');
    setScreens(result.data);
    setLoading(false);
    setSearch('');
  }

  return (
    <div className={classes.root}>
      <Card className={(classes.root, classes.cardcontent)}>
        <ScreensToolbar
          getScreens={getScreens}
          handleSearch={handleSearch}
          screens={search.length > 0 ? filtered : screens}
          search={search}
          className={classes.toolbar}
        />
        <div className={classes.content}>
          <ScreensTable
            getScreens={getScreens}
            loading={loading}
            screens={search.length > 0 ? filtered : screens}
          />
        </div>
      </Card>
    </div>
  );
};

export default DeviceScreen;
