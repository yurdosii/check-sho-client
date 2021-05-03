import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Link from 'next/link'
import Typography from '@material-ui/core/Typography';
import styles from '../styles/Campaign.module.css'

class Campaign extends Component {
    render() {
        const created_at = new Date(this.props.post.created_at)
        const is_active = this.props.post.is_active ? "Yes" : "Now"

        return (
            <div className={styles.campaign}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography
                            color="textSecondary"
                            gutterBottom
                        >
                            {/* <a href={this.props.post.market_details.url} target="_blank"> */}
                            {this.props.post.market_details.title}
                            {/* </a> */}
                        </Typography>
                        <Typography variant="h5" component="h2">
                            {this.props.post.title}
                        </Typography>
                        <Typography color="textSecondary">
                            {created_at.toLocaleString()}
                        </Typography>
                        <Typography color="textSecondary">
                            {this.props.post.description}
                        </Typography>
                        <Typography variant="body2" component="p">
                            Active: {is_active}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Link href={`/campaigns/${this.props.post.id}`}>
                            <Button size="small">Learn More</Button>
                        </Link>
                    </CardActions>
                </Card>
            </div>
        )
    }
}

export default Campaign;

