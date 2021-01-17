import React, { useContext, useState } from 'react';
import { AppBar, Toolbar, Typography, Menu, MenuItem, Button, Box, Drawer, List, ListItem, ListItemText } from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
// import MenuIcon from '@material-ui/icons/Menu';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { getCurrentUser } from '../FirebaseHelper';
import { AppContext } from '../AppContext';

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        fontWeight: 'bold',
        display: 'block',
        cursor: 'pointer',
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '20ch',
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    navButton: {
        marginLeft: theme.spacing(),
    },
    drawerContent: {
        width: 225,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
}));

const Navigation = ({ history }) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const matches = useMediaQuery('(min-width:960px)');
    const { login, logout, appState } = useContext(AppContext);

    const isMenuOpen = Boolean(anchorEl);

    // const handleProfileMenuOpen = (event) => {
    //     setAnchorEl(event.currentTarget);
    // };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const logUserOut = async () => {
        await logout();
        history.push('/');
    };
    const renderMenu = (
        <Menu anchorEl={anchorEl} keepMounted open={isMenuOpen} onClose={handleMenuClose} getContentAnchorEl={null} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} transformOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <MenuItem
                onClick={() => {
                    history.push('/');
                    handleMenuClose();
                }}
            >
                Home
            </MenuItem>
            {getCurrentUser() && getCurrentUser.isAnonymous && (
                <MenuItem
                    onClick={() => {
                        history.push('/polls');
                        handleMenuClose();
                    }}
                >
                    Polls
                </MenuItem>
            )}
            {getCurrentUser() && getCurrentUser.isAnonymous && (
                <MenuItem
                    onClick={() => {
                        history.push('/settings');
                        handleMenuClose();
                    }}
                >
                    Settings
                </MenuItem>
            )}
        </Menu>
    );

    const getNavbarControls = () => {
        if (!getCurrentUser() && !getCurrentUser.isAnonymous) {
            if (!appState.loading) {
                return (
                    <Button
                        onClick={() => {
                            login();
                        }}
                        color="secondary"
                        variant="contained"
                        className={classes.navButton}
                    >
                        Login
                    </Button>
                );
            }
            return <Box />;
        }
        return (
            <>
                {/* <IconButton color="inherit">
                    <Badge badgeContent={2} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton> */}
                {/* {!matches && (
                    <IconButton edge="end" onClick={handleProfileMenuOpen} color="inherit">
                        <MenuIcon />
                    </IconButton>
                )} */}
            </>
        );
    };

    return (
        <>
            <AppBar className={classes.appBar} position="fixed">
                <Toolbar>
                    <Typography
                        className={classes.title}
                        variant="h6"
                        noWrap
                        onClick={() => {
                            history.push('/');
                        }}
                    >
                        ezpoll
                    </Typography>
                    <Box className={classes.grow} />
                    {getNavbarControls()}
                </Toolbar>
            </AppBar>
            {renderMenu}
            {matches && getCurrentUser() && getCurrentUser.isAnonymous && (
                <Drawer variant="permanent">
                    <Toolbar />
                    <Box className={classes.drawerContent}>
                        <List>
                            <ListItem
                                button
                                onClick={() => {
                                    history.push('/');
                                }}
                            >
                                {/* <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <InboxIcon />}</ListItemIcon> */}
                                <ListItemText primary="Home" />
                            </ListItem>
                            {getCurrentUser() && getCurrentUser.isAnonymous && (
                                <>
                                    <ListItem
                                        button
                                        onClick={() => {
                                            history.push('/polls');
                                        }}
                                    >
                                        {/* <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <InboxIcon />}</ListItemIcon> */}
                                        <ListItemText primary="Polls" />
                                    </ListItem>
                                    <ListItem
                                        button
                                        onClick={() => {
                                            history.push('/settings');
                                        }}
                                    >
                                        {/* <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <InboxIcon />}</ListItemIcon> */}
                                        <ListItemText primary="Settings" />
                                    </ListItem>
                                    <ListItem
                                        button
                                        onClick={() => {
                                            logUserOut();
                                        }}
                                    >
                                        {/* <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <InboxIcon />}</ListItemIcon> */}
                                        <ListItemText primary="Log Out" />
                                    </ListItem>
                                </>
                            )}
                        </List>
                    </Box>
                </Drawer>
            )}
        </>
    );
};

Navigation.propTypes = {
    history: PropTypes.object,
};

export default withRouter(Navigation);
