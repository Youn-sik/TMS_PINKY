import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import { AccessesToolbar, AccessesTable } from './components';
import Card from '@material-ui/core/Card';
import moment from 'moment';
import 'moment/locale/ko';
import {base_url} from 'server.json';
import xlsx from 'xlsx';
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

const AccessList = props => {
  const { tempLimit, tempType } = props;
  const [accesses, setAccesses] = useState([]);
  const [page,setPage] = useState(1);//현재 페이지
  const [pages,setPages] = useState(0);//페이지 갯수
  const [date, setDate] = useState([
    moment()
      .locale('ko')
      .format('YYYY-MM-DD'),
    moment()
      .locale('ko')
      .format('YYYY-MM-DD')
  ]);
  const [type, setType] = useState('0');
  const [temp, setTemp] = useState('0');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filteredAccesses, setFilteredAccesses] = useState([]);
  const [activeType, setActiveType] = useState('access_time');
  const [sort, setSort] = useState('desc');

  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const classes = useStyles();

  const _setSearch = async e => {
    setSearch(e.target.value);
  };

  const clickExport = () => {

    const ordered = [];
    accesses.map((access) => {
      let temp = {}
      Object.keys(access).sort().forEach(function(key) {
        if(key !== '__v' && 
        key !== 'avatar_contraction_data' && 
        key !== 'avatar_file_checksum' && 
        key !== 'create_at' &&
        key !== 'create_ut' &&
        key !== 'stb_obid'){
          if(key === '_id')
            temp['아이디'] = access[key];
          else if(key === 'access_time')
            temp['출입 시간'] = access[key];
          else if(key === 'avatar_distance')
            temp['촬영 거리'] = access[key];
          else if(key === 'avatar_file_url')
            temp['사진 URL'] = access[key];
          else if(key === 'avatar_temperature')
            temp['온도'] = access[key];
          else if(key === 'avatar_type')
            temp['타입'] = access[key];
          else if(key === 'name')
            temp['이름'] = access[key];
          else if(key === 'stb_sn')
            temp['촬영 단말 시리얼 넘버'] = access[key];
        }
      });
      ordered.push(temp);
    })
    
    const ws = xlsx.utils.json_to_sheet(ordered);

    const wb = xlsx.utils.book_new();

    xlsx.utils.book_append_sheet(wb, ws, "Sheet1");

    xlsx.writeFile(wb, "Test.csv");
  }

  const clickSearch = async () => {
    setLoading(true);
    let headerType = activeType

    if(headerType === 'access_time')
      headerType = '_id'
    if(type === 'desc') 
      headerType = '-'+headerType;

    let _pages = await axios.get(base_url + 
      `/access?type=dateCount&date=${date[0]}/${date[1]}&search=${search}${type !== '0' ? "&avatar_type="+type : ''}&tempType=${temp}${temp !== '0' ? "&avatar_temperature="+tempLimit : ''}`, {
      cancelToken: source.token
    });

    let result = await axios.get(base_url + 
      `/access?date=${date[0]}/${date[1]}&page=${page}&search=${search}${type !== '0' ? "&avatar_type="+type : ''}&tempType=${temp}${temp !== '0' ? "&avatar_temperature="+tempLimit : ''}`, {
      cancelToken: source.token
    });

    setLoading(false);
    setPage(1);

    let count = 0 
      _pages.data.map(i => count += parseInt(i.count));

    if(_pages.data.length !== 0){
      let temp = parseInt(count/7);

      if(count%7)
        temp++;

      setPages(temp);
      setAccesses(result.data);
    } else {
      setPages(0);
      setAccesses([]);
    }
  }

  const sortAccesses = async (type, headerType) => {
    setActiveType(headerType);

    setLoading(true);
    if(headerType === 'access_time')
      headerType = '_id'
    if(type === 'desc') 
      headerType = '-'+headerType;

    let result = await axios.get(base_url + `/access?date=${date[0]}/${date[1]}&page=${1}&headerType=${headerType}`, {
      cancelToken: source.token
    });
    
    setLoading(false);
    setPage(1);
    setAccesses(result.data);
  };

  async function getAccesses() {
    setLoading(true)
    
    let _pages = await axios.get(base_url + 
      `/access?type=dateCount&date=${date[0]}/${date[1]}${type !== '0' ? "&avatar_type="+type : ''}&tempType=${temp}${temp !== '0' ? "&avatar_temperature="+tempLimit : ''}`, {
      cancelToken: source.token
    });

    if(_pages.data.length !== 0) {
      let result = await axios.get(base_url + 
        `/access?date=${date[0]}/${date[1]}&page=${page}${type !== '0' ? "&avatar_type="+type : ''}&tempType=${temp}${temp !== '0' ? "&avatar_temperature="+tempLimit : ''}`, {
        cancelToken: source.token
      });
      setPage(1);

      let count = 0 
      _pages.data.map(i => count += parseInt(i.count));

      let _temp = parseInt(count/7);
      if(count%7)
        _temp++;
  
      setPages(_temp);
      setAccesses(result.data);
    } else {
      setPages(0);
      setAccesses([]);
    }
    setLoading(false);
  }

  async function movePage(page) {
    let headerType = activeType
    setLoading(true);
    setPage(page)
    if(type === 'desc') 
      headerType = '-'+headerType;
      
    let result = await axios.get(base_url + `/access?date=${date[0]}/${date[1]}&page=${page}&headerType=${headerType}`, {
      cancelToken: source.token
    });

    setLoading(false);
    setAccesses(result.data);
  }

  useEffect(() => {
    getAccesses();
  },[type,temp,date])
  
  const _setSort = (type) => {
    setSort(type);
  }

  const handleType = _type => {
    setType(_type);
  };

  const handleTemp = temp => {
    setTemp(temp);
  };

  const handleDate = val => {
    setDate(val);
  };

  return (
    <div className={classes.root}>
      <Card className={(classes.root, classes.cardcontent)}>
        <AccessesToolbar
          clickExport={clickExport}
          search={search}
          loading={loading}
          setSearch={_setSearch}
          accesses={search !== '' ? filteredAccesses : accesses}
          className={classes.toolbar}
          dateChange={handleDate}
          type_change={handleType}
          type={type}
          temp_change={handleTemp}
          temp={temp}
          clickSearch={clickSearch}
        />
        <div className={classes.content}>
          <AccessesTable
            tempLimit={tempLimit}
            tempType={tempType}
            activeType={activeType}
            page={page}
            pages={pages}
            accesses={accesses}
            setPage={movePage}
            sortAccesses={sortAccesses}
            loading={loading}
            sort={sort}
            setSort={_setSort}
          />
        </div>
      </Card>
    </div>
  );
};

export default AccessList;
