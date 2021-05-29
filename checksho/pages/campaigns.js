import React, { useEffect, useState } from 'react';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CampaignTypeCell from 'components/campaignTypeCell';
import Checkbox from '@material-ui/core/Checkbox';
import Collapse from '@material-ui/core/Collapse';
import { Component } from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Header from '@/components/header';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Link from 'next/link'
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import { RestoreSharp } from '@material-ui/icons';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import styles from '../styles/Campaigns.module.css'
import { useRouter } from 'next/router'
import useToken from 'components/useToken';

// TODO - pagination
// TODO - filter / sorting

// TODO - back 
// - last_run, next_run

// TODO - front
// - якщо немає items треба вказати що немає
// - URL як дійсно URL (не забудь про target=_blank)
// - треба додавання items в CreateCampaign

// - треба якось едіт придумати і щоб там було зразу видалення (може чекбокси але тут або відкриття або вибір (може вибір дати людині типу як фільтр шо зараз вибираєш для видалення / edit або вибираєш для відкриття деталей)) (задумався що можна зробити як адмінці типу вибираєш і тоді що хочеш зробити, але напевно не бо там едіт по ссилці а в мене так не зробиш)

// якщо видалення - треба підтвердження шо ти хочеш видалити кампанії і такіто елементи (як в адмінці це можна зробити )) )


function Campaigns(props) {
    const router = useRouter();

    const [campaigns, setCampaigns] = useState([]);

    console.log("CAMPAIGN");
    console.log(campaigns);

    useEffect(() => {
        if (!props.token) { // TODO - check whether token is expided
            router.push('/sign_in');
        }

        const token = props.token;
        const API_URL = "http://127.0.0.1:8000/api"
        axios.get(
            `${API_URL}/campaigns/?expand=market_details&expand=items`,
            // { withCredentials: true, },
            { headers: { 'Authorization': `Bearer ${token}` } }
        ).then(res => {
            console.log(res)

            const campaigns = res.data;
            setCampaigns(campaigns);
        }).catch(error => {
            console.log(error)
        })
    }, [router]) // infinite loop of requests without this '[router]'

    return (
        <div className={styles.campaigns}>
            {/* <Header token={props.token} setToken={props.setToken}/> */}
            CAMPAIGNS
            <TableContainer component={Paper}>
                <Table size="small" aria-label="collapsible table">

                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Title</TableCell>
                            <TableCell align="right">Market</TableCell>
                            <TableCell align="right">Interval</TableCell>
                            <TableCell align="center">Type</TableCell>
                            <TableCell align="center">Active</TableCell>
                            <TableCell align="right">Items number</TableCell>
                            <TableCell align="right">Created</TableCell>
                            <TableCell align="right">Updated</TableCell>
                            <TableCell align="right">Last run</TableCell>
                            <TableCell align="right">Next run</TableCell>

                            {/* <TableCell align="right">Fat&nbsp;(g)</TableCell> */}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {campaigns.map((campaign) => (
                            <Row key={campaign.id} campaign={campaign} />
                        ))}
                    </TableBody>

                </Table>
            </TableContainer>
        </div>
    )
}

function renderTypeCells(types) {
    console.log(types);
    // const result = types.map((type) => <CampaignTypeCell key={type} type={type}/>);
    // return result
}


function Row(props) {
    const { campaign } = props;
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>

            <TableRow className={styles.tableRowRoot} hover onClick={() => setOpen(!open)}>
                <TableCell>
                    <IconButton aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>

                <TableCell align="left" component="th" scope="row">
                    {campaign.title}
                </TableCell>
                <TableCell align="right">{campaign.market}</TableCell>
                <TableCell align="right">{campaign.interval}</TableCell>
                <TableCell align="center">
                    <div className={styles.typeList}>
                        {campaign.types.map((type) => <CampaignTypeCell key={type} type={type} />)}
                    </div>
                </TableCell>
                <TableCell align="center">
                    <Checkbox className={styles.checkboxItem}
                        checked={campaign.is_active}
                        disabled={true}
                    />
                </TableCell>
                <TableCell align="right">{campaign.items.length}</TableCell>
                <TableCell align="right">
                    {campaign.created_at.slice(0, 10)}
                </TableCell>
                <TableCell align="right">
                    {campaign.updated_at.slice(0, 10)}
                </TableCell>
                <TableCell align="right">
                    {campaign.last_run ? campaign.last_run.slice(0, 10) : "Wasn't run"}
                </TableCell>
                <TableCell align="right">
                    {campaign.next_run ? campaign.next_run.slice(0, 10) : "Undefined"}
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={11}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>

                            <Typography variant="h6" gutterBottom component="div">
                                Items
                            </Typography>

                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>URL</TableCell>
                                        <TableCell>Title</TableCell>
                                        <TableCell align="right">Active</TableCell>
                                        {/* <TableCell align="right">
                                            Total price ($)
                                        </TableCell> */}
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {campaign.items.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                {item.url}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                {item.title}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Checkbox className={styles.checkboxItem}
                                                    checked={item.is_active}
                                                    disabled={true}
                                                />
                                            </TableCell>
                                            {/* <TableCell align="right">
                                                {
                                                    Math.round(
                                                        historyRow.amount * row.price * 100
                                                    ) / 100
                                                }
                                            </TableCell> */}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>

        </React.Fragment>
    );
}

// description
Row.propTypes = {
    campaign: PropTypes.shape({
        title: PropTypes.string.isRequired,
        market: PropTypes.string.isRequired,
        interval: PropTypes.string,
        created_at: PropTypes.string.isRequired,
        updated_at: PropTypes.string.isRequired,
        is_active: PropTypes.bool.isRequired,
        items: PropTypes.arrayOf(
            PropTypes.shape({
                title: PropTypes.string,
                url: PropTypes.string.isRequired,
                is_active: PropTypes.bool.isRequired,
            })
        ).isRequired,

        // calories: PropTypes.number.isRequired,
        // carbs: PropTypes.number.isRequired,
        // fat: PropTypes.number.isRequired,
        // history: PropTypes.arrayOf(
        //     PropTypes.shape({
        //         amount: PropTypes.number.isRequired,
        //         customerId: PropTypes.string.isRequired,
        //         date: PropTypes.string.isRequired,
        //     }),
        // ).isRequired,
        // name: PropTypes.string.isRequired,
        // price: PropTypes.number.isRequired,
        // protein: PropTypes.number.isRequired,
    }).isRequired,
};


export default Campaigns;


// // This function gets called at build time
// static async getInitialProps(ctx) {
//     // Call an external API endpoint to get posts
//     const token = localStorage.getItem("token");
//     const res = await fetch(
//         'http://127.0.0.1:8000/api/campaigns/?expand=market_details&expand=items',
//         {
//             headers: new Headers({
//                 'Authorization': `Bearer ${token}`,
//             })
//         }
//     );
//     let campaigns = []
//     if (res.ok) {
//         campaigns = await res.json();
//     }
//     console.log(campaigns);

//     // By returning { props: { campaigns } }, the Blog component
//     // will receive `campaigns` as a prop at build time
//     return {
//         campaigns,
//     }
// }




// const res = await fetch(
//     {
//         headers: new Headers('Authorization': `Bearer ${token}`),
//     }
// )
// let campaigns = []
// if (res.ok) {
//     campaigns = await res.json();
// }
// console.log(campaigns);

// document.title = `You clicked ${this.state.count} times`;