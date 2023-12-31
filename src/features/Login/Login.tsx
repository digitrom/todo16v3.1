import React from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useFormik} from "formik";
import {stringify} from "querystring";
import {loginTC} from "./auth-reducer";
import {useAppDispatch, useAppSelector} from "../../app/store";
import {Navigate} from "react-router-dom";

type ErrorType = {
    password?: string
    email?: string
    // rememberMe?:boolean
}


export type FormType = {
    password: string
    email: string
    rememberMe: boolean
}

export const Login = () => {
    const dispatch = useAppDispatch()
    const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn)
    console.log('4')

const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
    validate: (values) => {
        const errors: ErrorType = {};
        const regx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i

        console.log('values: ', values)
        if (!values.password) {
            errors.password = 'Required';
        } else if (values.password.length < 4) {
            errors.password = 'Must be more than 3 characters';
        }
        if (!values.email) {
            errors.email = 'Required';
        } else if (!regx.test(values.email)) {
            errors.email = 'Invalid email address';
        }
        console.log('errors: ', errors)
        return errors
    },
        onSubmit: async (values) => {
        const promise = await dispatch(loginTC(values))
            formik.resetForm()
        },
    })
    console.log(formik.values)

    if (isLoggedIn) return <Navigate to={'/'}/>

    return <Grid container justifyContent={'center'}>
        <Grid item justifyContent={'center'}>
            <FormControl>
                <FormLabel>
                    <p>To log in get registered
                        <a href={'https://social-network.samuraijs.com/'}
                           target={'_blank'}> here
                        </a>
                    </p>
                    <p>or use common test account credentials:</p>
                    <p>Email: free@samuraijs.com</p>
                    <p>Password: free</p>
                </FormLabel>
                <form onSubmit={formik.handleSubmit}><FormGroup>
                    <TextField
                        label="Email"
                        margin="normal"
                        {...formik.getFieldProps('email')}

                    />

                    {formik.touched.email && formik.errors.email && <div style={{color: 'red'}}>{formik.errors.email}</div>}

                    <TextField

                        type="password"
                        label="Password"
                        margin="normal"
                        {...formik.getFieldProps('password')}
                    />

                    {formik.touched.password && formik.errors.password && <div style={{color: 'red'}}>{formik.errors.password}</div>}

                    <FormControlLabel label={'Remember me'} control={<Checkbox checked={formik.values.rememberMe} {...formik.getFieldProps('rememberMe')}/>}/>
                    <Button type={'submit'} variant={'contained'} color={'primary'}>
                        Login
                    </Button>
                </FormGroup>
                </form>
            </FormControl>
        </Grid>
    </Grid>
}