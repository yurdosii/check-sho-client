import Button from '@material-ui/core/Button';
import Campaign from 'components/campaign';
import { Component } from 'react';
import Link from 'next/link'
import styles from '../styles/Home.module.css'

class Campaigns extends Component {

    // This function gets called at build time
    static async getInitialProps(ctx) {
        // Call an external API endpoint to get posts
        const res = await fetch('http://127.0.0.1:8000/api/campaigns/?expand=market_details');
        const posts = await res.json();

        // By returning { props: { posts } }, the Blog component
        // will receive `posts` as a prop at build time
        return {
            posts,
        }
    }

    render() {
        // console.log(this.props);
        return (
            <div>
                <Link href={`/add_campaign/`}>
                    <Button variant="contained" color="primary">
                        Add Campaign
                    </Button>
                </Link>
                <div className={styles.campaignList}>
                    {this.props.posts.map((post) => (
                        <Campaign key={post.id} post={post} />
                    ))}
                </div>
            </div>
        )
    }
}

export default Campaigns

