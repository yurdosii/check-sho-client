import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import styles from '../styles/CreateCampaign.module.css'
import { withRouter } from 'next/router'

class CreateCampaign extends Component {
    state = {
        title: "",
        description: "",
        market: "",
        interval: "",
        isActive: false,
    }

    handleTitleChange = (event) => {
        this.setState({ title: event.target.value })
    }

    handleDescriptionChange = (event) => {
        this.setState({ description: event.target.value })
    }

    handleMarketChange = (event) => {
        this.setState({ market: event.target.value })
    }

    handleIntervalChange = (event) => {
        this.setState({ interval: event.target.value })
    }

    handleIsActiveChange = (event) => {
        this.setState({ isActive: event.target.checked })
    }

    getMarketItems = () => {
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

    getIntervalItems = () => {
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

    handleSubmit = () => {
        const API_URL = "http://127.0.0.1:8000/api"
        console.log(this.state)

        axios.post(`${API_URL}/campaigns/`, {
            title: this.state.title.trim(),
            description: this.state.description.trim(),
            market: this.state.market,
            interval: this.state.interval,
            is_active: this.state.is_active
        }, {
            // withCredentials: true,
            xsrfCookieName: 'csrftoken',
            xsrfHeaderName: 'X-CSRFToken',
        }).then(res => {
            console.log(res);

            // go to /campaigns page
            this.props.router.push("/campaigns");
        }).catch(error => {
            console.log(error);
        })
    }

    render() {
        return (
            <div className={styles.createForm}>
                Campaign data
                <TextField
                    label="Title"
                    onChange={this.handleTitleChange}
                    value={this.state.title}
                />
                <TextField
                    label="Description"
                    onChange={this.handleDescriptionChange}
                    value={this.state.description}
                />
                <FormControl>
                    <InputLabel id="demo-simple-select-label">Market</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={this.state.market}
                        onChange={this.handleMarketChange}
                    >
                        {this.getMarketItems()}
                    </Select>
                </FormControl>

                <FormControl>
                    <InputLabel id="demo-simple-select-label">Interval</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={this.state.interval}
                        onChange={this.handleIntervalChange}
                    >
                        {this.getIntervalItems()}
                    </Select>
                </FormControl>

                <FormControlLabel
                    control={
                        <Checkbox className={styles.checkboxItem}
                            checked={this.state.isActive}
                            onChange={this.handleIsActiveChange}
                            name="isActive"
                        />
                    }
                    label="Active"
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handleSubmit}
                >
                    Create
                </Button>
            </div>
        )
    }
}

export default withRouter(CreateCampaign);

