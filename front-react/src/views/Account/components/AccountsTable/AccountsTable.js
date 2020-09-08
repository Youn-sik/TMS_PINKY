import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Pagination from '@material-ui/lab/Pagination';
import TextField from '@material-ui/core/TextField';
import Search from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import { NavLink as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import {
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  LinearProgress,
  Paper,
  TableContainer
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 1050
  },
  action: {
    padding:"10px 20px"
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  hightTempAvatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
  },
  buttonActions: {
    width: "100%",
  },
  buttonStyle: {
    margin:"5px",
    [theme.breakpoints.down(540)] : {
      margin:"5px 10%"
    }
  },
  activeStyle:{
    color: "white",
    textDecoration:"none"
  }
}));

const AccountsTable = props => {
  const {loading,accountsSearch,selectedNode,setAccountsSearch,setClickedNode,clickedNode,setAccounts,deleteAccounts,className,users, ...rest } = props;

  const classes = useStyles();

  const rowsPerPage= 7;
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const [selectedObject, setSelectedObject] = useState([]);

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const handleClick = (event, node, index) => {
    setSelectedObject([node]);
    setSelected([node._id]);
  };

  const handleSearch = (e) => {
    setAccountsSearch(e.target.value);
  }

  const isSelected = (_id) => selected.indexOf(_id) !== -1;

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      {/* <CardHeader subheader={ */}
        <CardActions className={classes.action}>
          <TextField
          className={classes.search}
          id="input-with-icon-textfield"
          // label="검색"
          value={accountsSearch}
          onChange={handleSearch}
          placeholder="검색"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end"><Search></Search></InputAdornment>
            ),
          }}
          />
          <Grid container justify="flex-end" className={classes.buttonActions}>
            {
              selected.length ? 
              <Button variant="contained" className={classes.buttonStyle} color="secondary" onClick={() =>{ deleteAccounts(selectedObject); setSelected([]); setSelectedObject([])}}>삭제</Button> :
              <Button variant="contained" className={classes.buttonStyle} color="secondary" disabled>삭제</Button>
            }
            {
              selected.length ? 
              <RouterLink style={{ textDecoration: 'none' }} to={{
                pathname:"/system/account/edit",
                selectedAccounts:selectedObject,
                }}><Button variant="contained" className={classes.buttonStyle} color="primary">수정</Button></RouterLink> :
              <Button variant="contained" color="primary" className={classes.buttonStyle} disabled>수정</Button> 
            }
            
            <RouterLink className={classes.buttonStyle} style={{ textDecoration: 'none' }} to={{
              pathname:"/system/account/add",
              }}><Button variant="contained" color="primary">추가</Button></RouterLink>
          </Grid>
        </CardActions>
      {/* }/> */}

      <CardContent className={classes.content}>
        {loading ? <LinearProgress style={{width:"100%"}}/> : null}
        <TableContainer component={Paper}>
            <Table className={classes.inner} size="small">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                  </TableCell>
                  <TableCell>아이디</TableCell>
                  <TableCell>권한</TableCell>
                  <TableCell>이름</TableCell>
                  <TableCell>언어</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.accounts.slice((page-1) * rowsPerPage, (page-1) * rowsPerPage + rowsPerPage).map((account,index) => {
                  const isItemSelected = isSelected(account._id);
                  return(
                    <TableRow
                      key={account._id}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          onChange={(event) => handleClick(event, account, index)}
                          checked={isItemSelected}
                        />
                      </TableCell>
                      <TableCell>{account.user_id}</TableCell>
                      <TableCell>{account.authority.split('-').length > 3 || account.authority.split('-')[1] === 'user' ? 
                      "사용자" : 
                      account.authority === 'admin' ? 
                      "관리자" : "매니저"}</TableCell>
                      <TableCell>{account.user_name}</TableCell>
                      <TableCell>{account.user_lang}</TableCell>
                    </TableRow>
                  )
                  })}
              </TableBody>
            </Table>
          </TableContainer>
      </CardContent>
      <CardActions className={classes.actions}>
        <Grid
          container
          alignItems="center"
          justify="center"
        >
         <Pagination
          count={ props.accounts.length%rowsPerPage === 0 ? parseInt(props.accounts.length/rowsPerPage) :
            parseInt(props.accounts.length/rowsPerPage+(parseInt(props.accounts.length%rowsPerPage)/parseInt(props.accounts.length%rowsPerPage)))}
          onChange={handlePageChange}
          page={page}
          variant="outlined" 
          shape="rounded"
          />
        </Grid>
      </CardActions>
    </Card>
  );
};

AccountsTable.propTypes = {
  className: PropTypes.string,
  deleteAccounts : PropTypes.func,
  setClickedNode : PropTypes.func,
  clickedNode : PropTypes.object,
  setAccounts : PropTypes.func,
  selectedNode : PropTypes.array
};



export default AccountsTable;
