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

const Stranger = (props) => {

  const base_url = "http://"+window.location.href.split('/')[2]+":3000"
  const [accesses,setAccesses] = useState([]);//화면에 보여질 출입 데이터
  const [originAcc,setOriginAcc] = useState([]);//모든 출입 데이터
  const [allAcc,setAllAcc] = useState([]);//해당 날짜의 모든 출입 데이터
  const [date,setDate] = useState([moment().locale('ko').format('YYYY-MM-DD'), moment().locale('ko').format('YYYY-MM-DD')]);
  const [temp,setTemp] = useState('0');
  const [loading,setLoading] = useState(true);
  const [activeType,setActiveType] = useState('access_time');
  
  useEffect(() => {
    getAccesses();
    return () => {
      source.cancel('Operation canceled by the user.');
    }
  },[])

  const classes = useStyles();

  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  async function getAccesses () {
    let result = await axios.get(base_url+'/access?type=3',{cancelToken: source.token})
    result.data.reverse()
    setOriginAcc(result.data)
    setAccesses(result.data.filter(i => i.access_time.split(' ')[0] === date[0]))
    setAllAcc(result.data.filter(i => i.access_time.split(' ')[0] === date[0]))
    setLoading(false);
    setDate([moment().locale('ko').format('YYYY-MM-DD'), moment().locale('ko').format('YYYY-MM-DD')]);
    setTemp('0');
  }

  const handleAllAccTemp = (i,_temp) => {
    let tempVal = _temp ? _temp : temp
    if(tempVal === '0') {
      return true;
    } else if (tempVal === '1') {
      return i.avatar_temperature < 37.5;
    } else {
      return i.avatar_temperature >= 37.5;
    }
  }

  const handleTemp = (temp) => {
    setTemp(temp)
    setAccesses(allAcc.filter((i) => {
      return handleAllAccTemp(i,temp)
    }))
  }

  const handleDate = (val) => {
    setDate(val);
    if(val[0] === val[1]) {
      setAccesses(originAcc.filter(i => i.access_time.split(' ')[0] === val[0]))
      setAllAcc(originAcc.filter(i => i.access_time.split(' ')[0] === val[0]))
      setTemp('0');
    } else {
      setAccesses(originAcc.filter(i => i.access_time.split(' ')[0] >= val[0] && i.access_time.split(' ')[0] <= val[1]))
      setAllAcc(originAcc.filter(i => i.access_time.split(' ')[0] >= val[0] && i.access_time.split(' ')[0] <= val[1]))
      setTemp('0');
    }
  }

  const sortAccesses = (type,headerType) => {
    setActiveType(headerType)
      if(headerType === 'avatar_temperature') {
        if(type === 'asc'){
          setAccesses(accesses.sort((a,b) => {
            if (a.avatar_temperature < b.avatar_temperature) return -1;
            else if (b.avatar_temperature < a.avatar_temperature) return 1;
            else return 0;
          }))
        } else {
          setAccesses(accesses.sort((a,b) => {
            if (a.avatar_temperature > b.avatar_temperature) return -1;
            else if (b.avatar_temperature > a.avatar_temperature) return 1;
            else return 0;
          }))
        }
      } else if(headerType === 'access_time') {
        if(type === 'asc'){
          setAccesses(accesses.sort((a,b) => {
            if (a.access_time < b.access_time) return -1;
            else if (b.access_time < a.access_time) return 1;
            else return 0;
          }))
        } else {
          setAccesses(accesses.sort((a,b) => {
            if (a.access_time > b.access_time) return -1;
            else if (b.access_time > a.access_time) return 1;
            else return 0;
          }))
        }
      }
  }

  return (
    <div className={classes.root}>
      <Card className={classes.root,classes.cardcontent}>
        <UsersToolbar loading={loading} className={classes.toolbar} dateChange={handleDate} temp_change={handleTemp} temp={temp}/>
        <div className={classes.content}>
          <UsersTable tempLimit={props.tempLimit} tempType={props.tempType} activeType={activeType} sortAccesses={sortAccesses} loading={loading} accesses={accesses} />
        </div>
      </Card>
    </div>
  );
};

export default Stranger;
