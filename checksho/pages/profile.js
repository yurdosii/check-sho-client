import { Controller, useForm } from "react-hook-form";
import React, { useCallback, useEffect, useState } from 'react';

import AppBar from '@material-ui/core/AppBar';
import { Bar } from 'react-chartjs-2';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Header from '@/components/header';
import Slide from '@material-ui/core/Slide';
import SwipeableViews from 'react-swipeable-views';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import TelegramIcon from '@material-ui/icons/Telegram';
import TelegramLoginButton from 'react-telegram-login';
import TextField from '@material-ui/core/TextField';
import { Typography } from '@material-ui/core';
import axios from 'axios';
import jwt_decode from "jwt-decode";
import styles from '../styles/Profile.module.css';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useTheme } from '@material-ui/core/styles';

function GetChartData(statsData) {
    const labels = ["Allo", "Citrus", "Epicentr"];
    const markets = statsData.markets;
    const datasetData = markets ? labels.map(label => markets[label]) : [0, 0, 0];

    const data = {
        labels: labels,
        datasets: [{
            label: "Campaigns by market",
            data: datasetData,
            backgroundColor: [
                "rgba(227, 24, 55, 0.7)",
                "rgba(255, 104, 10, 0.7)",
                "rgba(16, 96, 193, 0.7)"
            ],
            borderColor: [
                "rgb(227, 24, 55)",
                "rgb(255, 104, 10)",
                "rgb(16, 96, 193)"
            ],
            borderWidth: 1,
        }]
    }
    return data
}

function GetChartOptions() {
    const options = {
        responsive: true,
        scales: {
            y: {
                ticks: {
                    stepSize: 1
                }
            },
        },
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Campaigns by markets',
                font: {
                    size: "18",
                },
                padding: {
                    top: 10,
                    bottom: 20
                }
            }
        }
    }
    return options
}

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}


function Profile(props) {
    const router = useRouter();
    const theme = useTheme();

    const [statsData, setStatsData] = useState({});
    const [userData, setUserData] = useState(null);
    const [telegramUserData, setTelegramUserData] = useState(null);
    const [tabValue, setTabValue] = useState(0);

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const { handleSubmit, control, setValue } = useForm();

    const fetchUserDataAsync = useCallback(async (id, token) => {
        const API_URL = "http://127.0.0.1:8000/api"

        //TODO - handle 401, 404, ... 
        const responseUserData = await fetch(
            `${API_URL}/users/${id}/?expand=profileStatistics`,
            {
                headers: new Headers({
                    'Authorization': `Bearer ${token}`
                })
            }
        ).then(res => res.json());

        // set data
        setUserData(responseUserData);
        setStatsData(responseUserData.profileStatistics);
        setTelegramUserData(responseUserData.telegram_user)

        // set form default values
        setValue('username', responseUserData.username)
        setValue('email', responseUserData.email)
        setValue('first_name', responseUserData.first_name)
        setValue('last_name', responseUserData.last_name)
    }, []);

    useEffect(() => {
        if (!props.token) { // TODO - check whether token is expired
            router.push('/sign_in');
        }

        const token = props.token;
        const decoded = jwt_decode(token);
        fetchUserDataAsync(decoded.user_id, token);

    }, [fetchUserDataAsync])

    const handleTabChange = (event, tabValue) => {
        setTabValue(tabValue);
    };

    const handleTelegramResponse = response => {
        // telegram login callback
        // send POST request to /link_telegram/ and link telegram user to user

        const API_URL = "http://127.0.0.1:8000/api"
        const token = props.token;
        const decoded = jwt_decode(token);
        const user_id = decoded.user_id;

        // Link TelegramUser to User
        axios.post(`${API_URL}/users/${user_id}/link_telegram/`, response, {
            xsrfCookieName: 'csrftoken',
            xsrfHeaderName: 'X-CSRFToken',
            headers: { 'Authorization': `Bearer ${props.token}` }
        }).then(res => {
            console.log(res);
            const responseUserData = res.data;

            // set data
            setTelegramUserData(responseUserData.telegram_user)

            // TODO - snackbar

        }).catch(error => {
            console.log(error);
        });
    }

    const onSubmit = data => {
        const API_URL = "http://127.0.0.1:8000/api"
        const token = props.token;
        const decoded = jwt_decode(token);
        const user_id = decoded.user_id;

        // Update user
        axios.patch(`${API_URL}/users/${user_id}/`, data, {
            xsrfCookieName: 'csrftoken',
            xsrfHeaderName: 'X-CSRFToken',
            headers: { 'Authorization': `Bearer ${props.token}` }
        }).then(res => {
            console.log(res);

            // snackbar
            enqueueSnackbar("User saved", {
                variant: "success",
                anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right',
                },
                TransitionComponent: Slide,
                preventDuplicate: true,
                autoHideDuration: 1000
            });

        }).catch(error => {
            console.log(error);
        });
    };

    console.log("Rerender")
    console.log(userData);
    console.log(statsData);
    console.log();

    return (
        <div className={styles.page}>
            <Header token={props.token} setToken={props.setToken} />

            <div className={styles.pageContent}>

                <div className={styles.title}>
                    User profile
                </div>

                <AppBar position="static" color="default" className={styles.bar}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                    >
                        <Tab label="User information" {...a11yProps(0)} />
                        <Tab label="Statistics" {...a11yProps(1)} />
                    </Tabs>
                </AppBar>

                <SwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={tabValue}
                    onChangeIndex={handleTabChange}
                    className={styles.views}
                >
                    <div
                        dir={theme.direction}
                        role="tabpanel"
                        hidden={tabValue !== 0}
                        id={`full-width-tabpanel-0`}
                    >
                        <div className={styles.userInfo}>
                            <form onSubmit={handleSubmit(onSubmit)}
                                className={styles.userInfoForm}
                            >
                                <Controller
                                    name="username"
                                    control={control}
                                    defaultValue=""
                                    // defaultValue={userData ? userData.username : ""}
                                    rules={{
                                        // required: 'Field is required',
                                        // maxLength: { value: 1024, message: "Max length is 1024" }
                                    }}
                                    render={({ field, fieldState: { error } }) => {
                                        return <TextField {...field}
                                            label="Username"
                                            error={!!error}
                                            helperText={error ? error.message : null}
                                            className={styles.field}
                                        />
                                    }}
                                />
                                <Controller
                                    name="email"
                                    control={control}
                                    defaultValue=""
                                    rules={{
                                        // required: 'Field is required',
                                        // maxLength: { value: 1024, message: "Max length is 1024" }
                                    }}
                                    render={({ field, fieldState: { error } }) => {
                                        return <TextField {...field}
                                            label="Email"
                                            error={!!error}
                                            helperText={error ? error.message : null}
                                            className={styles.field}
                                        />
                                    }}
                                />
                                <Controller
                                    name="first_name"
                                    control={control}
                                    defaultValue=""
                                    rules={{
                                        // required: 'Field is required',
                                        // maxLength: { value: 1024, message: "Max length is 1024" }
                                    }}
                                    render={({ field, fieldState: { error } }) => {
                                        return <TextField {...field}
                                            label="First name"
                                            error={!!error}
                                            helperText={error ? error.message : null}
                                            className={styles.field}
                                        />
                                    }}
                                />
                                <Controller
                                    name="last_name"
                                    control={control}
                                    defaultValue=""
                                    rules={{
                                        // required: 'Field is required',
                                        // maxLength: { value: 1024, message: "Max length is 1024" }
                                    }}
                                    render={({ field, fieldState: { error } }) => {
                                        return <TextField {...field}
                                            label="Last name"
                                            error={!!error}
                                            helperText={error ? error.message : null}
                                            className={styles.field}
                                        />
                                    }}
                                />

                                {telegramUserData ?
                                    <Chip
                                        icon={<TelegramIcon />}
                                        label={
                                            `Telegram is connected (${telegramUserData.displayName})`
                                        }
                                        color="primary"
                                        className={styles.telegramChip}
                                    /> :
                                    <TelegramLoginButton
                                        dataOnauth={handleTelegramResponse}
                                        botName="checksho_bot"
                                        buttonSize="medium"
                                        className={styles.telegramButton}
                                    />
                                }

                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    className={styles.formButton}
                                >
                                    Save
                                </Button>
                            </form>
                        </div>

                    </div>
                    <div dir={theme.direction}
                        role="tabpanel"
                        hidden={tabValue !== 1}
                        id={`full-width-tabpanel-1`}
                    >
                        <div className={styles.userStats}>
                            <Typography>
                                Campaign number: {statsData.campaigns_number}
                            </Typography>
                            <Typography>
                                All items number: {statsData.items_number}
                            </Typography>
                            <Bar
                                data={GetChartData(statsData)}
                                width={200}
                                height={100}
                                options={GetChartOptions()}
                            />
                        </div>
                    </div>
                </SwipeableViews>

            </div>
        </div>
    )
}

export default Profile;
