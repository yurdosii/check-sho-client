import { Controller, useForm } from "react-hook-form";
import React, { useEffect, useState } from 'react';

import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import { makeStyles } from '@material-ui/core';
import styles from '../styles/CreateCampaign.module.css'
import { useRouter } from 'next/router'
import { withRouter } from 'next/router'

//TODO - edit page
//TODO - const API_URL

function getMarketItems() {
    const markets = ["Citrus", "Allo"];

    let items = []
    for (let i = 0; i < markets.length; ++i) {
        let item = (
            <MenuItem key={i} value={markets[i]}>
                {markets[i]}
            </MenuItem>
        )
        items.push(item)
    }

    return items;
}

function getIntervalItems() {
    const intervals = [
        ["HOUR", "Every hour"],
        ["DAY", "Every day"],
        ["WEEK", "Every week"],
    ];

    let items = []
    for (let i = 0; i < intervals.length; ++i) {
        let key = intervals[i][0];
        let value = intervals[i][1];

        let item = (
            <MenuItem key={i} value={key}>
                {value}
            </MenuItem>
        )
        items.push(item)
    }

    return items;
}

function CreateCampaign() {
    const router = useRouter();

    const { handleSubmit, control, reset } = useForm();
    const onSubmit = data => {
        const API_URL = "http://127.0.0.1:8000/api"
        console.log(data)

        axios.post(`${API_URL}/campaigns/`, {
            title: data.title.trim(),
            description: data.description.trim(),
            market: data.market,
            interval: data.interval,
            is_active: data.is_active
        }, {
            // withCredentials: true,
            xsrfCookieName: 'csrftoken',
            xsrfHeaderName: 'X-CSRFToken',
        }).then(res => {
            console.log(res);

            // go to /campaigns page
            router.push("/campaigns");
        }).catch(error => {
            console.log(error);
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.createForm}>
            Campaign
            <Controller
                name="title"
                control={control}
                defaultValue=""
                rules={{
                    required: 'Field is required',
                    maxLength: { value: 1024, message: "Max length is 1024" }
                }}
                render={({ field, fieldState: { error } }) => {
                    return <TextField {...field}
                        label="Title"
                        error={!!error}
                        helperText={error ? error.message : null}
                    />
                }}
            />

            <Controller
                name="description"
                control={control}
                defaultValue=""
                rules={{
                    required: false,
                    maxLength: { value: 1024, message: "Max length is 1024" }
                }}
                render={({ field, fieldState: { error } }) => {
                    return <TextField {...field}
                        label="Description"
                        error={!!error}
                        helperText={error ? error.message : null}
                    />
                }}
            />

            <Controller
                name="market"
                control={control}
                defaultValue=""
                rules={{ required: 'Field is required', }}
                render={({ field, fieldState: { error } }) => {
                    return (
                        <FormControl error={!!error}>
                            <InputLabel>
                                Market
                            </InputLabel>
                            <Select {...field}>
                                {getMarketItems()}
                            </Select>
                            <FormHelperText>
                                {error ? error.message : null}
                            </FormHelperText>
                        </FormControl>
                    )
                }}
            />

            <Controller
                name="interval"
                control={control}
                defaultValue=""
                rules={{ required: 'Field is required', }}
                render={({ field, fieldState: { error } }) => {
                    return (
                        <FormControl error={!!error}>
                            <InputLabel>
                                Interval
                            </InputLabel>
                            <Select {...field}>
                                {getIntervalItems()}
                            </Select>
                            <FormHelperText>
                                {error ? error.message : null}
                            </FormHelperText>
                        </FormControl>
                    )
                }}
            />

            <Controller
                name="is_active"
                control={control}
                defaultValue={false}
                render={({ field }) => {
                    return (
                        <FormControlLabel
                            control={
                                <Checkbox {...field}
                                    className={styles.checkboxItem}
                                    checked={field.value}
                                />
                            }
                            label="Active"
                        />
                    )
                }}
            />

            <Button
                variant="contained"
                color="primary"
                type="submit"
            >
                Create
            </Button>
        </form>
    );
}

export default CreateCampaign;



{/* <InputLabel id="demo-simple-select-label">Market</InputLabel>
                            <Select {...field}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                            ></Select> */}