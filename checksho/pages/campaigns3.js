import { INTERVALS_RENDER, MARKETS_LINKS } from "@/constants/campaign";
import React, { useEffect, useState } from 'react';

import Button from '@material-ui/core/Button';
import Header from '@/components/header';
import Link from 'next/link'
import MaterialTable from 'material-table'
import Slide from '@material-ui/core/Slide';
import axios from 'axios';
import { isTokenExpired } from "@/components/useToken";
import styles from '../styles/Campaigns.module.css'
import tableIcons from '@/components/tableIcons';
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack';

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getType(rowData) {
    const result = rowData.types.map(
        item => capitalizeFirstLetter(item.toLowerCase())
    ).toString();
    return result;
}


function Campaigns(props) {
    const router = useRouter();

    const [campaigns, setCampaigns] = useState([]);

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    useEffect(() => {
        if (!props.token || isTokenExpired(props.token)) {
            // Token expired or doesn't exist
            props.setToken("");  // null -> "null" so empty string
            router.push('/sign_in');
        } else {
            const token = props.token;
            const API_URL = "http://127.0.0.1:8000/api"

            axios.get(
                `${API_URL}/campaigns/?expand=market_details&expand=items`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            ).then(res => {
                console.log(res)

                const campaigns = res.data;
                setCampaigns(campaigns);
            }).catch(error => {
                console.log(error)
            })
        }
    }, [router]) // infinite loop of requests without this '[router]'

    const deleteCampaign = id => {
        const token = props.token;
        const API_URL = "http://127.0.0.1:8000/api"
        axios.delete(
            `${API_URL}/campaigns/${id}/`,
            { headers: { 'Authorization': `Bearer ${token}` } }
        ).then(res => {
            console.log(res)
        }).catch(error => {
            console.log(error)
        })
    }

    const [columns, setColumns] = useState([
        {
            title: 'Title',
            field: 'title',
        },
        {
            title: 'Market',
            field: 'market',
            render: rowData => {
                return (
                    <Link href={MARKETS_LINKS[rowData.market]}>
                        <a className={styles.url} target="_blank">
                            {rowData.market}
                        </a>
                    </Link>
                )
            }
        },
        {
            title: 'Interval',
            field: 'interval',
            render: rowData => INTERVALS_RENDER[rowData.interval]
        },
        {
            title: 'Type',
            render: getType
        },
        {
            title: 'Active',
            field: 'is_active',
            type: 'boolean'
        },
        {
            title: 'Items number',
            type: 'numeric',
            align: 'left',
            render: rowData => rowData.items.length,
            customSort: (a, b) => a.items.length - b.items.length
        },
        {
            title: 'Created at',
            field: 'created_at',
            type: 'datetime',
            cellStyle: { fontSize: "0.95rem" },
        },
        {
            title: 'Updated at',
            field: 'updated_at',
            type: 'datetime',
            cellStyle: { fontSize: "0.95rem" },
        },
        {
            title: 'Last run',
            field: 'last_run',
            type: 'datetime',
            emptyValue: "Wasn't run",
            cellStyle: { fontSize: "0.95rem" },
        },
        {
            title: 'Next run',
            field: 'next_run',
            type: 'datetime',
            emptyValue: "Undefined",
            cellStyle: { fontSize: "0.95rem" },
        },
    ]);

    const [columnsItems, setColumnsItems] = useState([
        {
            title: 'Title',
            field: 'title',
            headerStyle: {
                width: "30%",
                maxWidth: "30%",
                paddingLeft: "5rem",
            },
            cellStyle: {
                width: "30%",
                maxWidth: "30%",
                paddingLeft: "5rem",
            },
        },
        {
            title: 'URL',
            field: 'url',
            headerStyle: {
                width: "60%",
                maxWidth: "60%",
            },
            cellStyle: { width: "60%", maxWidth: "60%" },
            render: rowData => {
                return (
                    <Link href={rowData.url}>
                        <a className={styles.url} target="_blank">
                            {rowData.url}
                        </a>
                    </Link>
                )
            }
        },
        {
            title: 'Active',
            field: 'is_active',
            type: 'boolean',
            headerStyle: {
                width: "10%",
                maxWidth: "10%",
            },
            cellStyle: { width: "10%", maxWidth: "10%" },
        },
    ]);

    const editable = {
        onRowDelete: oldData =>
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    const dataDelete = [...campaigns];

                    // delete from server
                    deleteCampaign(oldData.id)

                    // delete in list
                    const index = oldData.tableData.id;
                    dataDelete.splice(index, 1);
                    setCampaigns([...dataDelete]);

                    // snackbar
                    enqueueSnackbar(`Campaign '${oldData.title}' was deleted`, {
                        variant: "success",
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'right',
                        },
                        TransitionComponent: Slide,
                        preventDuplicate: true,
                        autoHideDuration: 2000
                    });

                    resolve()
                }, 1000)
            }),
    }


    return (
        <div className={styles.page}>
            <Header token={props.token} setToken={props.setToken} nameToDisplay={props.nameToDisplay} />

            <div className={styles.pageContent}>
                <Link href={`/add_campaign`} className={styles.addCampaignButton}>
                    <Button
                        variant="contained"
                        color="primary"
                        className={styles.addCampaignButton}
                    >
                        Create
                    </Button>
                </Link>

                <MaterialTable
                    columns={columns}
                    data={campaigns}
                    title="Campaigns"
                    icons={tableIcons}
                    editable={editable}
                    options={{
                        // search: true, // TODO - think about it
                        detailPanelType: "single",
                        // padding: "dense",
                        // searchFieldAlignment: 'right'
                        // actionsCellStyle: {
                        //     width: "10%",
                        //     maxWidth: "10%",
                        // },
                        headerStyle: {
                            fontWeight: "bold",
                        }
                    }}
                    actions={[
                        {
                            // TODO - this
                            icon: tableIcons.Run,
                            tooltip: 'Run campaign',
                            onClick: (event, rowData) => alert("Run campaign Yura")
                        },
                        {
                            icon: tableIcons.Edit,
                            tooltip: 'Edit campaign',
                            onClick: (event, rowData) => router.push(`/edit_campaign/${rowData.id}`)
                        },
                    ]}
                    localization={{
                        body: {
                            emptyDataSourceMessage: 'No campaigns were created',
                            editRow: {
                                deleteText: "Are you sure you want to delete this campaign?"
                            }
                        }
                    }}
                    detailPanel={[
                        {
                            tooltip: "Show items",
                            render: rowData => {
                                return (
                                    <MaterialTable
                                        columns={columnsItems}
                                        data={rowData.items}
                                        title="Items"
                                        icons={tableIcons}
                                        options={{
                                            pageSize: 3,
                                            padding: "dense"
                                        }}
                                    />
                                )
                            }
                        }
                    ]}
                />
            </div>
        </div>
    )
}

export default Campaigns;
