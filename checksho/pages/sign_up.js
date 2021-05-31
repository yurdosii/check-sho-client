import { Controller, useForm } from "react-hook-form";
import React, { useEffect } from 'react';

import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import LockIcon from '@material-ui/icons/Lock';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import styles from '../styles/Auth.module.css'
import { useRouter } from 'next/router'

function SignUp(props) {
    const router = useRouter();

    useEffect(() => {
        if (props.token) {
            router.push('/');
        }
    })

    const { handleSubmit, control, reset } = useForm();
    // const onSubmit = data => console.log(data);
    const onSubmit = data => {
        const API_URL = "http://127.0.0.1:8000/api"

        axios.post(`${API_URL}/auth/registration/`, {
            username: data.username,
            password1: data.password1,
            password2: data.password2
        }, {
            xsrfCookieName: 'csrftoken',
            xsrfHeaderName: 'X-CSRFToken',
        }).then(res => {
            console.log(res);

            const token = res.data.access_token;
            props.setToken(token);

            const username = res.data.user.username;
            props.setNameToDisplay(username);
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
                    Sign Up
                </div>
                <Controller
                    name="username"
                    control={control}
                    defaultValue=""
                    rules={{
                        required: 'Field is required',
                        // maxLength: { value: 30, message: "Max length is 30" }
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
                    name="password1"
                    control={control}
                    defaultValue=""
                    rules={{
                        required: 'Field is required',
                        minLength: { value: 8, message: "Min length is 8" },
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

                <Controller
                    name="password2"
                    control={control}
                    defaultValue=""
                    rules={{
                        required: 'Field is required',
                        minLength: { value: 8, message: "Min length is 8" },
                        maxLength: { value: 128, message: "Max length is 128" }
                    }}
                    render={({ field, fieldState: { error } }) => {
                        return <TextField {...field}
                            label="Password again"
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
                    Sign up
                </Button>
                <Link href={`/sign_in/`} className={styles.link}>
                    Already have an account? Sign in
                </Link>
            </form>
        </div>
    );
}

export default SignUp;
