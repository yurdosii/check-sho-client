import { Controller, useForm } from "react-hook-form";
import React, { useEffect, useState } from 'react';

import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import LockIcon from '@material-ui/icons/Lock';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import styles from '../styles/Auth.module.css'
import { useRouter } from 'next/router'
import useToken from 'components/useToken';

//TODO - const API_URL


function SignIn(props) {
    const router = useRouter();

    useEffect(() => {
        if (props.token) {
            router.push('/'); // TODO - campaigns
        }
    })

    const { handleSubmit, control, reset } = useForm();
    const onSubmit = data => {
        const API_URL = "http://127.0.0.1:8000/api"
        console.log(data)

        axios.post(`${API_URL}/auth/login/`, {
            username: data.username,
            password: data.password
        }, {
            xsrfCookieName: 'csrftoken',
            xsrfHeaderName: 'X-CSRFToken',
        }).then(res => {
            console.log(res);

            const token = res.data.access_token;
            props.setToken(token);
        }).catch(error => {
            console.log(error);
        })
    }

    return (
        <div className={styles.signPage}>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <div className={styles.iconDiv}>
                    <LockIcon className={styles.icon} />
                </div>
                <div className={styles.title}>
                    Sign in
                </div>
                <Controller
                    name="username"
                    control={control}
                    defaultValue=""
                    rules={{
                        required: 'Field is required',
                        // maxLength: { value: 30, message: "Max length is 30" }
                        // TODO - кастомний, username = 30, email_address = 254
                    }}
                    render={({ field, fieldState: { error } }) => {
                        return <TextField {...field}
                            label="Username or email address"
                            error={!!error}
                            helperText={error ? error.message : null}
                            className={styles.field}
                        />
                    }}
                />

                <Controller
                    name="password"
                    control={control}
                    defaultValue=""
                    rules={{
                        required: 'Field is required',
                        maxLength: { value: 128, message: "Max length is 128" }
                    }}
                    render={({ field, fieldState: { error } }) => {
                        return <TextField {...field}
                            label="Password"
                            error={!!error}
                            helperText={error ? error.message : null}
                            type="password"
                            className={styles.field}
                        />
                    }}
                />

                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    className={styles.submitButton}
                >
                    Sign in
                </Button>
                <Link href={`/sign_up/`} className={styles.link}>
                    Don't have an account? Sign up
                </Link>
            </form>
        </div>
    );
}

export default SignIn;

// SignIn.propTypes = {
//     setToken: PropTypes.func.isRequired
// }