import React, { useState,useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import { UsersToolbar, UsersTable } from './components';
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

const UserList = () => {

  const [accesses,setAccesses] = useState([]);//화면에 보여질 출입 데이터
  const [originAcc,setOriginAcc] = useState([]);//모든 출입 데이터
  const [allAcc,setAllAcc] = useState([]);//해당 날짜의 모든 출입 데이터
  const [date,setDate] = useState([moment().locale('ko').format('YYYY-MM-DD'), moment().locale('ko').format('YYYY-MM-DD')]);
  const [type,setType] = useState('0');
  const [temp,setTemp] = useState('0');
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    getAccesses();
  },[])

  const classes = useStyles();

  async function getAccesses () {
    let result = await axios.get('http://172.16.135.89:3000/access')
    result.data.reverse()
    setOriginAcc(result.data)
    setAccesses(result.data.filter(i => i.access_time.split(' ')[0] === date[0]))
    setLoading(false)
  }

  const handleAllAccTemp = (i,_temp) => {
    let tempVal = _temp ? _temp : temp
    if(tempVal === '0') {
      return true;
    } else if (tempVal === '1') {
      return i.avatar_temperature < 38;
    } else {
      return i.avatar_temperature >= 38;
    }
  }

  const handleAllAccType = (i,_type) => {
    let typeVal = _type ? _type : type
    if(typeVal === '0') {
      return true;
    } else {
      return i.avatar_type === parseInt(typeVal)
    }
  }

  const handleType = (_type) => {
    setType(_type)
    setAccesses(allAcc.filter((i) => {
      return handleAllAccTemp(i) && handleAllAccType(i,_type);
    }))
  }

  const handleTemp = (temp) => {
    setTemp(temp)
    setAccesses(allAcc.filter((i) => {
      console.log(handleAllAccTemp(i,temp) && handleAllAccType(i))
      return handleAllAccTemp(i,temp) && handleAllAccType(i);
    }))
  }

  const handleDate = (val) => {
    setDate(val);
    if(val[0] === val[1]) {
      setAccesses(originAcc.filter(i => i.access_time.split(' ')[0] === val[0]))
      setAllAcc(originAcc.filter(i => i.access_time.split(' ')[0] === val[0]))
      setTemp('0');
      setType('0');
    } else {
      setAccesses(originAcc.filter(i => i.access_time.split(' ')[0] >= val[0] && i.access_time.split(' ')[0] <= val[1]))
      setAllAcc(originAcc.filter(i => i.access_time.split(' ')[0] >= val[0] && i.access_time.split(' ')[0] <= val[1]))
      setTemp('0');
      setType('0');
    }
  }


  return (
    <div className={classes.root}>
      <Card className={classes.root,classes.cardcontent}>
        <UsersToolbar className={classes.toolbar} dateChange={handleDate} type_change={handleType} type={type} temp_change={handleTemp} temp={temp}/>
        <div className={classes.content}>
          <UsersTable loading={loading} accesses={accesses} />
        </div>
      </Card>
    </div>
  );
};

export default UserList;
