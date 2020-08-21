import React, { useState,useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/styles';
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

const Operation = () => {
  const [oper,setOper] = useState([]);
  // const [originUsers,setOriginUsers] = useState([]);
  const [date,setDate] = useState([moment().locale('ko').format('YYYY-MM-DD'), moment().locale('ko').format('YYYY-MM-DD')]);
  const [searchVal, setSearchVal] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getOper();
  },[])

  const classes = useStyles();

  async function getOper () {
    let result = await axios.get('http://172.16.135.89:3000/operation')
    result.data.reverse()
    // setOriginUsers(result.data)
    setOper(result.data.filter(user => user.date.split(' ')[0] >= date[0] && user.date.split(' ')[0] <= date[1]))
    setLoading(false);
  }

  const searchEvent = (e) => {
    setSearchVal(e.target.value)
  }

  const handleDate = (val) => {
    setDate(val);
    let date_oper = oper.filter(user => user.date.split(' ')[0] >= val[0] && user.date.split(' ')[0] <= val[1])
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
