import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Divider, Drawer } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import ImageIcon from '@material-ui/icons/Image';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import SettingsIcon from '@material-ui/icons/Settings';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import SyncAltIcon from '@material-ui/icons/SyncAlt';
import DnsIcon from '@material-ui/icons/Dns';
import InsertChartIcon from '@material-ui/icons/InsertChart';

import { Profile, SidebarNav } from './components';

const useStyles = makeStyles(theme => ({
  drawer: {
    width: 240,
    [theme.breakpoints.up('lg')]: {
      marginTop: 64,
      height: 'calc(100% - 64px)'
    }
  },
  root: {
    backgroundColor: theme.palette.white,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2)
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  }
}));

const Sidebar = props => {
  const { open, variant, onClose, className, ...rest } = props;

  const classes = useStyles();

  const pages = [
    {
      title: '종합 현황판',
      href: '/dashboard',
      icon: <DashboardIcon />
    },
    {
      title:"출입, 출근 관리",
      href: '/access',
      icon: <SyncAltIcon/>,
      children:[
        {
          title:'출입 관리',
          href:'/access/records'
        },
        {
          title:'출근 관리',
          href:'/access/attendance'
        }
      ],
    },
    {
      title: '인사관리',
      href: '/users',
      children:[
        {
          title:'사원 관리',
          href:'/users/employee'
        },
        {
          title:'방문자 관리',
          href:'/users/visitor'
        },
        {
          title:'블랙리스트 관리',
          href:'/users/black'
        },
        {
          title:'미등록자 관리',
          href:'/users/stranger'
        }
      ],
      icon: <PeopleIcon />
    },
    {
      title: '단말 관리',
      children:[
        {
          title:'단말기 목록',
          href:'/device/list'
        },
        {
          title:'단말기 에러 로그',
          href:'/device/error'
        },
        {
          title:'단말기 스크린샷',
          href:'/device/screen'
        },
      ],
      icon: <DnsIcon />
    },
    {
      title: '통계',
      href:'/stats/device',
      icon: <InsertChartIcon />
    },
    {
      title: '시스템',
      children:[
        {
          title:"계정 관리",
          href:'/system/account'
        },
        {
          title:'작업 기록',
          href:'/system/operation'
        },
      ],
      icon: <SettingsIcon />
    },
    // {
    //   title: 'Products',
    //   href: '/products',
    //   icon: <ShoppingBasketIcon />
    // },
    // {
    //   title: 'Authentication',
    //   href: '/sign-in',
    //   icon: <LockOpenIcon />
    // },
    // {
    //   title: 'Typography',
    //   href: '/typography',
    //   icon: <TextFieldsIcon />
    // },
    // {
    //   title: 'Icons',
    //   href: '/icons',
    //   icon: <ImageIcon />
    // },
    // {
    //   title: 'Account',
    //   href: '/account',
    //   icon: <AccountBoxIcon />
    // },
    // {
    //   title: 'Settings',
    //   href: '/settings',
    //   icon: <SettingsIcon />
    // }
  ];

  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}
    >
      <div
        {...rest}
        className={clsx(classes.root, className)}
      >
        {/* <Profile />
        <Divider className={classes.divider} /> */}
        <SidebarNav
          className={classes.nav}
          pages={pages}
        />
      </div>
    </Drawer>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
};

export default Sidebar;
