import React, { useState } from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar, SnackbarContent } from 'notistack';
import Collapse from '@material-ui/core/Collapse';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles(theme => ({
    root: {
        [theme.breakpoints.up('sm')]: {
            minWidth: '344px !important',
        },
    },
    card: {
        backgroundColor: '#d32f2f',
        width: '100%',
    },
    typography: {
        color:'white',
        fontWeight: 'bold',
    },
    actionRoot: {
        padding: '8px 8px 8px 16px',
    },
    icons: {
        marginLeft: 'auto',
    },
    expand: {
        color:'white',
        padding: '8px 8px',
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    collapse: {
        padding: 16,
    },
    checkIcon: {
        fontSize: 20,
        color: 'white',
        paddingRight: 4,
    },
    button: {
        padding: 0,
        textTransform: 'none',
    },
}));

const SnackMessage = React.forwardRef((props, ref) => {
    const classes = useStyles();
    const { closeSnackbar } = useSnackbar();
    const [expanded, setExpanded] = useState(true);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleDismiss = () => {
        closeSnackbar(props.id);
    };

    const moveAccessRecords = () => {
        if(props.path === '/access/records')
            props.history.go(0)
        else
            props.history.push('/access/records')
    }

    return (
        <SnackbarContent ref={ref} className={classes.root}>
            <Card className={classes.card}>
                <CardActions classes={{ root: classes.actionRoot }}>
                    <Typography variant="subtitle2" className={classes.typography}>{props.message.split("|")[0]}</Typography>
                    <div className={classes.icons} style={{float:"right"}}>
                        <IconButton
                            aria-label="Show more"
                            className={classnames(classes.expand, { [classes.expandOpen]: expanded })}
                            onClick={handleExpandClick}
                        >
                            <ExpandMoreIcon />
                        </IconButton>
                        <IconButton className={classes.expand} onClick={handleDismiss}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <Paper className={classes.collapse} style={{textAlign: 'center'}}>
                        <Typography gutterBottom style={{fontWeight: 'bold',float: 'left',}}>인식된 사진</Typography>
                        <Typography gutterBottom style={{fontWeight: 'bold',float: 'right',cursor: 'pointer'}} onClick={moveAccessRecords}>자세히 보기</Typography><br/>
                        <img style={{maxWidth: '50vw', width: '100%',maxHeight: '70vh'}} src={props.message.split('|')[1]}></img>
                    </Paper>
                </Collapse>
            </Card>
        </SnackbarContent>
    );
});

export default SnackMessage;