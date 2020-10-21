import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import { AccessesToolbar, AccessesTable } from './components';
import Card from '@material-ui/core/Card';
import moment from 'moment';
import 'moment/locale/ko';
import {base_url} from 'server.json';
import ExcelJS from 'exceljs/dist/es5/exceljs.browser.js'
import { saveAs } from 'file-saver'
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
  const [rowsPerPage,setRowsPerPage] = useState('7');
  const [searchType,setSearchType] = useState('name')
  const [selected, setSelected] = useState([]);

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = accesses.map(n => n);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const deleteAccesses = async () => {
    if(window.confirm('삭제한 내용은 되돌릴수 없습니다\n정말 삭제하시겠습니까?')) {
      await axios.delete(base_url +'/access', {
        data: {
          accesses_data : selected
        }
      })
      getAccesses()
      alert('삭제 되었습니다.')
    }
  }

  const handleClick = (event, node, index) => {
    const selectedIndex = selected.findIndex(i => i._id == node._id);
    let newSelected = [];
    if (selectedIndex === -1) {
      node.index = index;
      newSelected = newSelected.concat(selected, node);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const isSelected = _id => selected.findIndex(i => i._id == _id) !== -1;
  
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const classes = useStyles();

  const _setSearch = async e => {
    setSearch(e.target.value);
  };

  const handleRowsPerPage = e => {
    setRowsPerPage(e.target.value);
  }

  const handleSearchType = (e) => {
    setSearchType(e.target.value);
  }

  const clickExport = async () => {

    const wb = new ExcelJS.Workbook()

    const ws = wb.addWorksheet("Info", {properties:{ defaultRowHeight: 50 }})

    

    ws.addRow(['사진', '이름', '단말기 이름','단말기 시리얼','단말기 위치','타입','거리','온도','출입 시간'])
    accesses.map((access,index) => {
      let temp = []
      let image = wb.addImage({
        base64: access.avatar_file,
        extension: 'png'
      })

      temp.push('');
      temp.push(access['name']);
      temp.push(access['stb_name'])
      temp.push(access['stb_sn'])
      temp.push(access['stb_location'])
      temp.push(access['avatar_type'] === 1 ? '사원' : access['avatar_type'] === 3 ? '미등록자' : '블랙리스트');
      temp.push(String(access['avatar_distance']).substring(0,3)+"M");
      temp.push(access['avatar_temperature'].length < 4 ? access['avatar_temperature'] : access['avatar_temperature'].substring(0,4));
      temp.push(access['access_time']);

      ws.addRow(temp)
      ws.addImage(image,{
        tl: { col: 0, row: 1+index },
        br: { col: 0.7, row: 2+index }
      })
    })

    const buf = await wb.xlsx.writeBuffer()
    
    saveAs(new Blob([buf]), 'access_records_'+moment().locale('ko').format('YYYY-MM-DD HH:mm:ss')+'.xlsx')
  }

  const clickSearch = async () => {
    setLoading(true);
    let headerType = activeType

    if(headerType === 'access_time')
      headerType = '_id'
    if(type === 'desc') 
      headerType = '-'+headerType;

    let _pages = await axios.get(base_url + 
      `/access?searchType=${searchType}&search=${search}&type=dateCount&date=${date[0]}/${date[1]}&rowsPerPage=${rowsPerPage}&avatar_type=${type}&tempType=${temp}${temp !== '0' ? "&avatar_temperature="+tempLimit : ''}`, {
      cancelToken: source.token
    });

    let result = await axios.get(base_url + 
      `/access?searchType=${searchType}&date=${date[0]}/${date[1]}&rowsPerPage=${rowsPerPage}&page=${page}&search=${search}&avatar_type=${type}&tempType=${temp}${temp !== '0' ? "&avatar_temperature="+tempLimit : ''}`, {
      cancelToken: source.token
    });

    setLoading(false);
    setPage(1);

    let count = _pages.data[0].count;

    if(_pages.data.length !== 0){
      let temp = parseInt(count/rowsPerPage);

      if(count%rowsPerPage)
        temp++;

      setPages(temp);
      setAccesses(result.data);
    } else {
      setPages(0);
      setAccesses([]);
    }
  }

  const sortAccesses = async (_type, headerType) => {
    setActiveType(headerType);

    setLoading(true);
    if(headerType === 'access_time')
      headerType = '_id'
    if(_type === 'desc') 
      headerType = '-'+headerType;
      let result = await axios.get(base_url + 
        `/access?searchType=${searchType}&rowsPerPage=${rowsPerPage}&headerType=${headerType}&date=${date[0]}/${date[1]}&page=${page}&search=${search}&avatar_type=${type}&tempType=${temp}${temp !== '0' ? "&avatar_temperature="+tempLimit : ''}`, {
      cancelToken: source.token
    });

    let _pages = await axios.get(base_url + 
      `/access?searchType=${searchType}&type=dateCount&date=${date[0]}/${date[1]}&rowsPerPage=${rowsPerPage}&search=${search}&avatar_type=${type}&tempType=${temp}${temp !== '0' ? "&avatar_temperature="+tempLimit : ''}`, {
      cancelToken: source.token
    });

    let count = _pages.data[0].count;

    let _temp = parseInt(count/rowsPerPage);
    if(count%rowsPerPage)
      _temp++;

    setPages(_temp);
    
    setLoading(false);
    setPage(1);
    setAccesses(result.data);
  };

  async function getAccesses() {
    setLoading(true)
    
    let _pages = await axios.get(base_url + 
      `/access?searchType=${searchType}&search=${search}&type=dateCount&rowsPerPage=${rowsPerPage}&date=${date[0]}/${date[1]}&avatar_type=${type}&tempType=${temp}${temp !== '0' ? "&avatar_temperature="+tempLimit : ''}`, {
      cancelToken: source.token
    });

    if(_pages.data.length !== 0) {
      let result = await axios.get(base_url + 
        `/access?searchType=${searchType}&search=${search}&date=${date[0]}/${date[1]}&&rowsPerPage=${rowsPerPage}page=${page}&avatar_type=${type}&tempType=${temp}${temp !== '0' ? "&avatar_temperature="+tempLimit : ''}`, {
        cancelToken: source.token
      });
      setPage(1);

      let count = _pages.data[0].count;

      let _temp = parseInt(count/rowsPerPage);
      if(count%rowsPerPage)
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
    if(sort === 'desc') 
      headerType = '-'+headerType;
      
    let result = await axios.get(base_url + `/access?searchType=${searchType}&search=${search}&date=${date[0]}/${date[1]}&avatar_type=${type}&page=${page}&headerType=${headerType}&rowsPerPage=${rowsPerPage}`, {
      cancelToken: source.token
    });

    let _pages = await axios.get(base_url + 
      `/access?searchType=${searchType}&search=${search}&type=dateCount&date=${date[0]}/${date[1]}&rowsPerPage=${rowsPerPage}&search=${search}&avatar_type=${type}&tempType=${temp}${temp !== '0' ? "&avatar_temperature="+tempLimit : ''}`, {
      cancelToken: source.token
    });

    let count = _pages.data[0].count;

    let _temp = parseInt(count/rowsPerPage);
    if(count%rowsPerPage)
      _temp++;

    setPages(_temp);

    setLoading(false);
    setAccesses(result.data);
  }

  useEffect(() => {
    getAccesses();
  },[type,temp,date,rowsPerPage])
  
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
          deleteAccesses={deleteAccesses}
          clickExport={clickExport}
          search={search}
          handleSearchType={handleSearchType}
          searchType = {searchType}
          loading={loading}
          handleRowsPerPage={handleRowsPerPage}
          rowsPerPage={rowsPerPage}
          setSearch={_setSearch}
          accesses={search !== '' ? filteredAccesses : accesses}
          className={classes.toolbar}
          dateChange={handleDate}
          type_change={handleType}
          type={type}
          date={date}
          temp_change={handleTemp}
          temp={temp}
          clickSearch={clickSearch}
        />
        <div className={classes.content}>
          <AccessesTable
            handleSelectAllClick={handleSelectAllClick}
            isSelected={isSelected}
            handleClick={handleClick}
            selected={selected}
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
