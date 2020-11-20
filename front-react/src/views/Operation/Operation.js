import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import { OperToolbar, OperTable } from './components';
import Card from '@material-ui/core/Card';
import moment from 'moment';
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

const Operation = props => {
  const [oper, setOper] = useState([]);
  const [allOper, setAllOper] = useState([]);
  const [filteredOper, setFilteredOper] = useState([]);
  // const [originUsers,setOriginUsers] = useState([]);
  const [date, setDate] = useState([
    moment()
      .locale('ko')
      .format('YYYY-MM-DD'),
    moment()
      .locale('ko')
      .format('YYYY-MM-DD')
  ]);
  const [searchVal, setSearchVal] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState('');
  const [search, setSearch] = useState('');
  const [searchType, setSearchType] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const getOper = useCallback(async (headerType = "-_id") => {
    let result = await axios.get(base_url + `/operation?date=${date[0]}/${date[1]}&authority=${props.authority}&headerType=${headerType}&page=${page}`);
    if(result && result.data.data.length > 0){
      let temp = parseInt(result.data.count/7)

      if(parseInt(result.data.count%7))
        temp++;
      
      setPages(temp);
      setOper(result.data.data);
    }
    setLoading(false);
  }, [page,date]);

  const searchOper = async () => {
    let result = await axios.get(base_url + `/operation?date=${date[0]}/${date[1]}&authority=${props.authority}&search=${search}&searchType=${searchType}`);
    result.data.reverse();
    // setOriginUsers(result.data)
    setAllOper(result.data);
    setOper(
      result.data.filter(
        user =>
          user.date.split(' ')[0] >= date[0] &&
          user.date.split(' ')[0] <= date[1]
      )
    );
    setLoading(false);
  }

  const sortAccesses = (type, headerType) => {
    setActiveType(headerType);
    if(type === 'desc')
      headerType = '-'+headerType;
    
    getOper(headerType)
  };

  useEffect(() => {
    getOper();
  }, []);

  const classes = useStyles();

  const searchEvent = e => {
    setSearchVal(e.target.value);
  };

  useEffect(() => {
    getOper();
  }, [date,page]);

  const handleDate = val => {
    setDate(val);
  };


  

  return (
    <div className={classes.root}>
      <Card className={(classes.root, classes.cardcontent)}>
        <OperToolbar
          loading={loading}
          className={classes.toolbar}
          dateChange={handleDate}
          search_val={searchVal}
          search_event={searchEvent}
        />
        <div className={classes.content}>
          <OperTable pages={pages} page={page} handlePageChange={handlePageChange} loading={loading} oper={oper} />
        </div>
      </Card>
    </div>
  );
};

export default Operation;
