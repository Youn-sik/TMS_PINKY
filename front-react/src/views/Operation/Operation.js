import React, { useState,useEffect,useCallback } from 'react';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import { OperToolbar, OperTable } from './components';
import Card from '@material-ui/core/Card';
import moment from 'moment';
import 'moment/locale/ko'
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  },
  cardcontent: {
    padding: 0,
    "&:last-child": {
      paddingBottom: 0
    }
  },
  toolbar: {
    padding:"20px 0px 10px 20px"
  }
}));

const Operation = (props) => {
  const base_url = "http://"+window.location.href.split('/')[2]+":3000"
  const [oper,setOper] = useState([]);
  const [allOper,setAllOper] = useState([]);
  const [filteredOper,setFilteredOper] = useState([]);
  // const [originUsers,setOriginUsers] = useState([]);
  const [date,setDate] = useState([moment().locale('ko').format('YYYY-MM-DD'), moment().locale('ko').format('YYYY-MM-DD')]);
  const [searchVal, setSearchVal] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeType,setActiveType] = useState('');
  const [search,setSearch] = useState('');

  const getOper = useCallback(async () => {
    let result = await axios.get(base_url+'/operation')
    result.data.reverse()
    // setOriginUsers(result.data)
    setAllOper(result.data)
    setOper(result.data.filter(user => user.date.split(' ')[0] >= date[0] && user.date.split(' ')[0] <= date[1]))
    setLoading(false);
    setDate([moment().locale('ko').format('YYYY-MM-DD'), moment().locale('ko').format('YYYY-MM-DD')]);
    setSearchVal("");
  },[date])
  
  const sortAccesses = (type,headerType) => {
    setActiveType(headerType)
      if(headerType === 'user_id') {
        if(type === 'asc'){
          setOper(oper.sort((a,b) => {
            if (a.id.user_id < b.id.user_id) return -1;
            else if (b.id.user_id < a.id.user_id) return 1;
            else return 0;
          }))
        } else {
          setOper(oper.sort((a,b) => {
            if (a.id.user_id > b.id.user_id) return -1;
            else if (b.id.user_id > a.id.user_id) return 1;
            else return 0;
          }))
        }
      } else if(headerType === 'date') {
        if(type === 'asc'){
          setOper(oper.sort((a,b) => {
            if (a.date < b.date) return -1;
            else if (b.date < a.date) return 1;
            else return 0;
          }))
        } else {
          setOper(oper.sort((a,b) => {
            if (a.date > b.date) return -1;
            else if (b.date > a.date) return 1;
            else return 0;
          }))
        }
      } else if(headerType === 'action') {
        if(type === 'asc'){
          setOper(oper.sort((a,b) => {
            if (a.action < b.action) return -1;
            else if (b.action < a.action) return 1;
            else return 0;
          }))
        } else {
          setOper(oper.sort((a,b) => {
            if (a.action > b.action) return -1;
            else if (b.action > a.action) return 1;
            else return 0;
          }))
        }
      }
  }

  useEffect(() => {
    getOper();
  },[])

  const classes = useStyles();

  const searchEvent = (e) => {
    setSearchVal(e.target.value)
  }

  useEffect(() => {
    
  },[searchVal])

  const handleDate = (val) => {
    setDate(val);
    let date_oper = allOper.filter(user => user.date.split(' ')[0] >= val[0] && user.date.split(' ')[0] <= val[1])
    setOper(date_oper);
  }


  return (
    <div className={classes.root}>
      <Card className={classes.root,classes.cardcontent}>
        <OperToolbar className={classes.toolbar} dateChange={handleDate} search_val={searchVal} search_event={searchEvent}/>
        <div className={classes.content}>
          <OperTable loading={loading} oper={oper} />
        </div>
      </Card>
    </div>
  );
};

export default Operation;
