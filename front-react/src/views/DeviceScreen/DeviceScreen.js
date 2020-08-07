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

const DeviceScreen = () => {

  const [accesses,setAccesses] = useState([]);//화면에 보여질 출입 데이터
  const [filtered,setFiltered] = useState([]);
  const [originAcc,setOriginAcc] = useState([]);//모든 출입 데이터
  const [allAcc,setAllAcc] = useState([]);//해당 날짜의 모든 출입 데이터
  const [date,setDate] = useState([moment().locale('ko').format('YYYY-MM-DD'), moment().locale('ko').format('YYYY-MM-DD')]);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState('');
  const [loading,setLoading] = useState(true);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    let temp = accesses.filter(i => i._id.serial_number.indexOf(e.target.value) > -1)
    if(e.target.value === '') {
      setFiltered([])
    } else {
      setFiltered(temp)
    }
  }

  useEffect(() => {
    getAccesses();
  },[])

  const classes = useStyles();

  async function getAccesses () {
    let result = await axios.get('http://172.16.135.89:3000/camera_monitor?id=one_device')
    setOriginAcc(result.data)
    setAccesses(result.data)
    setLoading(false)
  }

  return (
    <div className={classes.root}>
      <Card className={classes.root,classes.cardcontent}>
        <UsersToolbar handleSearch={handleSearch} search={search} className={classes.toolbar}/>
        <div className={classes.content}>
          <UsersTable loading={loading} accesses={search.length > 0  ? filtered : accesses } />
        </div>
      </Card>
    </div>
  );
};

export default DeviceScreen;
