import AccountCircle from '@material-ui/icons/AccountCircle';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Link from 'next/link'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import axios from 'axios';
import styles from '../styles/Header.module.css'
import { useRouter } from 'next/router'

export default function MenuAppBar(props) {
    const router = useRouter();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogOut = () => {
        const API_URL = "http://127.0.0.1:8000/api"

        axios.post(`${API_URL}/auth/logout/`, {
        }, {
            xsrfCookieName: 'csrftoken',
            xsrfHeaderName: 'X-CSRFToken',
            headers: { 'Authorization': `Bearer ${props.token}` }
        }).then(res => {
            console.log(res);

            props.setToken("");  // null -> "null" so empty string

            // go to /sign_in page
            router.push("/sign_in");
        }).catch(error => {
            console.log(error);
        })
    }

    return (
        <div className={styles.root}>
            <AppBar position="static">
                <Toolbar>
                    <Link href={`/`}>
                        <a className={styles.link}>Checksho</a>
                    </Link>
                    <Link href={`https://t.me/checksho_bot`}>
                        <a className={styles.telegramBotLink}>Telegram-bot</a>
                    </Link>
                    <div className={styles.sepDiv}>

                    </div>
                    {props.token && (
                        <div>
                            <IconButton
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <div className={styles.accountDiv}>
                                    <AccountCircle />
                                    <div className={styles.accountText}>
                                        {props.nameToDisplay ? props.nameToDisplay : ""}
                                    </div>
                                </div>
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={open}
                                onClose={handleClose}
                            >
                                <MenuItem>
                                    <Link href={`/profile`} >
                                        <a>Profile</a>
                                    </Link>
                                </MenuItem>
                                <MenuItem onClick={handleLogOut}>Log out</MenuItem>
                            </Menu>
                        </div>
                    )}
                    {!props.token && (
                        <div>
                            <Link href={`/sign_in`} >
                                <a className={styles.link}>Sign in</a>
                            </Link>
                            <Link href={`/sign_up`}>
                                <a className={styles.link}>Sign up</a>
                            </Link>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
        </div>
    );
}
