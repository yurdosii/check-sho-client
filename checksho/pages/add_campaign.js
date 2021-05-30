import { Controller, useForm } from "react-hook-form";
import { INTERVALS, MARKETS } from "@/constants/campaign";
import React, { useEffect, useState } from 'react';

import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Header from '@/components/header';
import InputLabel from '@material-ui/core/InputLabel';
import MaterialTable from 'material-table'
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import { isTokenExpired } from "@/components/useToken";
import jwt_decode from "jwt-decode";
import styles from '../styles/AddEditCampaign.module.css'
import tableIcons from '@/components/tableIcons';
import { useRouter } from 'next/router'

function getMarketItems() {
    let items = []
    for (let i = 0; i < MARKETS.length; ++i) {
        let item = (
            <MenuItem key={i} value={MARKETS[i]}>
                {MARKETS[i]}
            </MenuItem>
        )
        items.push(item)
    }

    return items;
}

function getIntervalItems() {
    let items = []
    for (let i = 0; i < INTERVALS.length; ++i) {
        let key = INTERVALS[i][0];
        let value = INTERVALS[i][1];

        let item = (
            <MenuItem key={i} value={key}>
                {value}
            </MenuItem>
        )
        items.push(item)
    }

    return items;
}


function CreateCampaign(props) {
    const router = useRouter();

    const { handleSubmit, control } = useForm(); // {mode: 'onBlur'}

    useEffect(() => {
        if (!props.token || isTokenExpired(props.token)) {
            props.setToken("");  // null -> "null" so empty string
            router.push('/sign_in');
        }
    })

    // MaterialTable
    const columns = [
        {
            title: 'Title',
            field: 'title',
            type: 'string',
            editComponent: props => (
                <TextField
                    type="text"
                    placeholder="Title"
                    value={props.value ? props.value : ""}
                    helperText="Set empty to be parsed from page"
                    onChange={e => props.onChange(e.target.value)}
                    className={styles.itemInput}
                />
            ),
            headerStyle: { width: "30%", maxWidth: "30%", fontSize: "0.9rem" },
            cellStyle: { width: "30%", maxWidth: "30%", fontSize: "0.9rem" },
        },
        {
            title: 'URL',
            field: 'url',
            type: 'string',
            editComponent: props => (
                <TextField
                    type="text"
                    placeholder="URL"
                    value={props.value ? props.value : ""}
                    helperText="Required*"
                    onChange={e => props.onChange(e.target.value)}
                    className={styles.itemInput}
                />
            ),
            validate: rowData => Boolean(rowData.url),
            headerStyle: { width: "55%", maxWidth: "55%", fontSize: "0.9rem" },
            cellStyle: { width: "55%", maxWidth: "55%", fontSize: "0.9rem" },
        },
        {
            title: 'Active',
            field: 'is_active',
            type: 'boolean',
            initialEditValue: true,
            headerStyle: { width: "3%", maxWidth: "3%", fontSize: "0.9rem" },
            cellStyle: { width: "3%", maxWidth: "3%", fontSize: "0.9rem" },
        },
        {
            title: 'Notify sale',
            field: 'is_notify_sale',
            type: 'boolean',
            initialEditValue: false,
            headerStyle: { width: "3%", maxWidth: "3%", fontSize: "0.85rem" },
            cellStyle: { width: "3%", maxWidth: "3%", fontSize: "0.85rem" },
        },
        {
            title: 'Notify availability',
            field: 'is_notify_available',
            type: 'boolean',
            initialEditValue: false,
            headerStyle: { width: "3%", maxWidth: "3%", fontSize: "0.85rem" },
            cellStyle: { width: "3%", maxWidth: "3%", fontSize: "0.85rem" },
        },
    ];

    const [itemsData, setItemsData] = useState([]);

    const editable = {
        onRowAdd: newData =>
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    setItemsData([...itemsData, newData]);

                    resolve();
                }, 1000)
            }),
        onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    const dataUpdate = [...itemsData];
                    const index = oldData.tableData.id;
                    dataUpdate[index] = newData;
                    setItemsData([...dataUpdate]);

                    resolve();
                }, 1000)
            }),
        onRowDelete: oldData =>
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    const dataDelete = [...itemsData];
                    const index = oldData.tableData.id;
                    dataDelete.splice(index, 1);
                    setItemsData([...dataDelete]);

                    resolve()
                }, 1000)
            }),
    }

    const onSubmit = data => {
        const API_URL = "http://127.0.0.1:8000/api"

        const token = props.token;
        const decoded = jwt_decode(token);
        const owner_id = decoded.user_id;

        // Create campaign
        axios.post(`${API_URL}/campaigns/`, {
            title: data.title.trim(),
            market: data.market,
            interval: data.interval,
            is_active: data.is_active,
            is_telegram_campaign: data.is_telegram_campaign,
            is_email_campaign: data.is_email_campaign,
            owner: owner_id,
        }, {
            xsrfCookieName: 'csrftoken',
            xsrfHeaderName: 'X-CSRFToken',
            headers: { 'Authorization': `Bearer ${props.token}` }
        }).then(res => {
            console.log(res);
            const createdCampaign = res.data;
            const campaignId = createdCampaign.id

            // Create campaign items
            axios.post(`${API_URL}/campaigns/${campaignId}/campaign-items/create_list/`,
                itemsData,
                {
                    xsrfCookieName: 'csrftoken',
                    xsrfHeaderName: 'X-CSRFToken',
                    headers: { 'Authorization': `Bearer ${props.token}` }
                }).then(res => {
                    console.log(res);

                    // go to /campaigns page
                    router.push("/");
                }).catch(error => {
                    console.log(error);
                });


        }).catch(error => {
            console.log(error);
        });
    }

    return (
        <div className={styles.page}>
            <Header token={props.token} setToken={props.setToken} nameToDisplay={props.nameToDisplay} />

            <div className={styles.pageContent}>

                <div className={styles.title}>
                    Create campaign
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className={styles.createForm}>
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
                                className={styles.field}
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
                                <FormControl error={!!error} className={styles.field}>
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
                                <FormControl error={!!error} className={styles.field}>
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
                        name="is_email_campaign"
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
                                    label="Is email campaign"
                                />
                            )
                        }}
                    />

                    <Controller
                        name="is_telegram_campaign"
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
                                    label="Is telegram campaign"
                                />
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
                                    label="Is campaign active"
                                />
                            )
                        }}
                    />

                    <div className={styles.items}>

                        <MaterialTable
                            columns={columns}
                            data={itemsData}
                            title="Items"
                            icons={tableIcons}
                            editable={editable}
                            options={{
                                pageSize: 3,
                                padding: "dense"
                            }}
                            localization={{
                                // header: {
                                //     actions: 'Actions'
                                // },
                                body: {
                                    emptyDataSourceMessage: 'No items were added',
                                }
                            }}
                            options={{
                                actionsCellStyle: {
                                    width: "10%",
                                    maxWidth: "10%",
                                },
                                headerStyle: {
                                    fontWeight: "bold",
                                },
                                // cellStyle: { padding: '0.5em'},
                                // headerStyle: { padding: '0.5em'},
                            }}
                        />
                    </div>

                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        className={styles.submitButton}
                    >
                        Create
                    </Button>
                </form>

            </div>
        </div>
    );
}

export default CreateCampaign;
