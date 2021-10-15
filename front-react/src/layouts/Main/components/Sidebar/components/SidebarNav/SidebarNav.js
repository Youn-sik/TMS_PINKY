/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React, { forwardRef, useEffect } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { List, ListItem, Button, colors } from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
const useStyles = makeStyles(theme => ({
  root: {},
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0
  },
  button: {
    color: colors.blueGrey[800],
    padding: '10px 8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontWeight: theme.typography.fontWeightMedium
  },
  icon: {
    color: theme.palette.icon,
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1)
  },
  active: {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
    '& $icon': {
      color: theme.palette.primary.main
    }
  },
  expand: {
    margin: '0px 0px 0px 10px'
  }
}));

const CustomRouterLink = forwardRef((props, ref) => (
  <div ref={ref} style={{ flexGrow: 1 }}>
    <RouterLink style={{ textDecoration: 'none' }} {...props} />
  </div>
));

const SidebarNav = props => {
  const { pages, className, ...rest } = props;

  const [open, setOpen] = React.useState(
    props.path.split('/')[1] === 'device'
      ? '단말 관리'
      : props.path.split('/')[1] === 'access'
      ? '출입, 출근 관리'
      : props.path.split('/')[1] === 'users'
      ? '인사관리'
      : props.path.split('/')[1] === 'stats'
      ? '통계'
      : props.path.split('/')[1] === 'system'
      ? '시스템'
      : ''
  );
  const classes = useStyles();

  const handleClick = title => event => {
    if (title === open) {
      setOpen('');
    } else {
      setOpen(title);
    }
  };
  
  // useEffect(() => {
  //   console.log(open)
  // },[open])
  
  return (
    <List {...rest} className={clsx(classes.root, className)}>
      {pages.map(page => {
        if (!page.children) {
          return (
            <ListItem className={classes.item} disableGutters key={page.title}>
              <Button
                activeClassName={classes.active}
                className={classes.button}
                component={CustomRouterLink}
                onClick = {() => {
                  if(page.title == '통학버스') window.location.href = "http://jeju.specialschoolbus.com/school/login.html"
                }}
                to={page.href}
                >
                <div className={classes.icon}>{page.icon}</div>
                {page.title}
              </Button>
            </ListItem>
          );
        } else {
          return (
            <div key={page.title}>
              <ListItem
                onClick={handleClick(page.title)}
                className={classes.item}
                disableGutters
                key={page.title}>
                <Button className={classes.button} to={page.href}>
                  <div className={classes.icon}>{page.icon}</div>
                  {page.title}
                  {open === page.title ? (
                    <ExpandLess className={classes.expand} />
                  ) : (
                    <ExpandMore className={classes.expand} />
                  )}
                </Button>
              </ListItem>
              <Collapse in={open === page.title} timeout="auto" unmountOnExit>
                <List {...rest} className={clsx(classes.root, className)}>
                  {page.children.map(chid => (
                    <ListItem
                      className={classes.item}
                      disableGutters
                      key={chid.title}>
                      <Button
                        activeClassName={classes.active}
                        className={classes.button}
                        component={CustomRouterLink}
                        to={chid.href}>
                        <div className={classes.icon}></div>
                        {chid.title}
                      </Button>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </div>
          );
        }
      })}
    </List>
  );
};

SidebarNav.propTypes = {
  className: PropTypes.string,
  pages: PropTypes.array.isRequired
};

export default SidebarNav;
