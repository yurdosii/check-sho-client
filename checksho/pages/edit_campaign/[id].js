import { Controller, useForm } from "react-hook-form";
import { INTERVALS, MARKETS } from "@/constants/campaign";
import React, { useCallback, useEffect, useState } from 'react';

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
import styles from '../../styles/AddEditCampaign.module.css'
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


function EditCampaign(props) {
    const router = useRouter();
    const campaign_id = router.query.id; // ? router.query.id : 0;

    const { handleSubmit, control, reset } = useForm(); // {mode: 'onBlur'}
    // const onSubmit = data => console.log(data);

    const onSubmit = data => {
        const API_URL = "http://127.0.0.1:8000/api"
        // console.log(data);
        // console.log(itemsData);

        axios.patch(`${API_URL}/campaigns/${campaign_id}/`, {
            title: data.title.trim(),
            market: data.market,
            interval: data.interval,
            is_active: data.is_active,
            is_telegram_campaign: data.is_telegram_campaign,
            is_email_campaign: data.is_email_campaign,
        }, {
            xsrfCookieName: 'csrftoken',
            xsrfHeaderName: 'X-CSRFToken',
            headers: { 'Authorization': `Bearer ${props.token}` }
        }).then(res => {
            console.log(res);

            axios.patch(`${API_URL}/campaigns/${campaign_id}/campaign-items/update_list/`,
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

    const fetchCampaignDataAsync = useCallback(async (token) => {
        const API_URL = "http://127.0.0.1:8000/api"

        const responseUserData = await fetch(
            `${API_URL}/campaigns/${campaign_id}/?expand=items`,
            {
                headers: new Headers({
                    'Authorization': `Bearer ${token}`
                })
            }
        ).then(res => res.json());

        // console.log("FETCH")
        // console.log(responseUserData);
        // console.log("")

        // set controllers (campaign data)
        reset(responseUserData);

        // set items data
        setItemsData(responseUserData.items);

        // set form default values
        // setValue('username', responseUserData.username)
        // setValue('email', responseUserData.email)
        // setValue('first_name', responseUserData.first_name)
        // setValue('last_name', responseUserData.last_name)
    }, [campaign_id]);

    useEffect(async () => {
        if (!props.token || isTokenExpired(props.token)) {
            props.setToken("");  // null -> "null" so empty string
            router.push('/sign_in');
        }
        else if (campaign_id) {
            fetchCampaignDataAsync(props.token);
        }
    }, [campaign_id])

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

    return (
        <div className={styles.page}>
            <Header token={props.token} setToken={props.setToken} nameToDisplay={props.nameToDisplay} />

            <div className={styles.pageContent}>

                <div className={styles.title}>
                    Edit campaign
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
                        Save
                    </Button>
                </form>

            </div>
        </div>
    );

}


export default EditCampaign;
