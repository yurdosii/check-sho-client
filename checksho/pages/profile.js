import { Controller, useForm } from "react-hook-form";
import React, { useCallback, useEffect, useState } from 'react';

import { Bar } from 'react-chartjs-2';
import Button from '@material-ui/core/Button';
import Header from '@/components/header';
import TextField from '@material-ui/core/TextField';
import { Typography } from '@material-ui/core';
import jwt_decode from "jwt-decode";
import styles from '../styles/Profile.module.css';
import { useRouter } from 'next/router';

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

function Profile(props) {
    const router = useRouter();

    const [statsData, setStatsData] = useState({});
    const [userData, setUserData] = useState(null);
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

    // TODO - submit
    const onSubmit = data => console.log(data);

    return (
        <div className={styles.page}>
            <Header token={props.token} setToken={props.setToken} />
            <div className={styles.pageContent}>
                <div className={styles.title}>
                    User profile
                </div>
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
                    Stats
                </div>

            </div>
        </div>
    )
}

export default Profile;
