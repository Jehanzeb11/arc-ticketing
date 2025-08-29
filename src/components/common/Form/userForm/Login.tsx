'use client'
import React, { useState, useRef } from 'react'
import { jwtDecode } from 'jwt-decode'
import { useRouter } from 'next/navigation'
import { FieldValues, useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import AuthInput from '@/components/common/Input/AuthInput'
import icon2 from '@/assets/icons/auth/icon2.svg'
import icon3 from '@/assets/icons/auth/icon3.svg'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import Link from 'next/link'
import { Box } from '@mui/material'
import { useApiStore } from '@/lib/api/apiStore'

export default function LoginForm () {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset
  } = useForm()
  const { callApi, loginUser }: any = useApiStore()

  const router = useRouter()
  const [is2FARequired, setIs2FARequired] = useState(false)
  const tokenRef = useRef(null)

  const loginMutation = useMutation({
    // mutationFn: async data => {
    //   const response = await fetch(`/api/Session/login`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //       params: {
    //         login: data.login,
    //         password: data.password
    //       }
    //     })
    //   })

    //   if (!response.ok) {
    //     throw new Error('Invalid login or password')
    //   }

    //   const result = await response.json()
    //   return result
    // },
    mutationFn: (data: FieldValues) =>
      callApi(
        loginUser,
        {
          params: {
            login: data.login,
            password: data.password
          }
        },
        {},
        null,
        { headers: { 'X-Request-Source': 'SignUpForm' } }
      ),
    onSuccess: data => {
      const token = data.access_token
      if (token) {
        tokenRef.current = token
        setIs2FARequired(true)
        const decoded: any = jwtDecode(token)
        const userData = {
          login: decoded.login,
          role: decoded.realm
        }

        // 🔹 cookies me save karo
        Cookies.set('user_data', JSON.stringify(userData))
        reset({ twoFACode: '' })

        toast.success('Please enter the 2FA code sent to your email.')
      } else {
        handleLoginSuccess(tokenRef.current)
      }
    },
    onError: error => {
      console.error('Login Error:', error)
      // toast.error(error.message || 'Invalid login or password')
    }
  })

  const verify2FAMutation = useMutation({
    mutationFn: data => Promise.resolve(data),
    onSuccess: data => {
      const expectedCode = '123456'
      if (data.twoFACode === expectedCode) {
        console.log('2FA Code Valid, proceeding to login')
        handleLoginSuccess(tokenRef.current) // ✅ fix here
      } else {
        toast.error('Invalid 2FA code')
      }
    },
    onError: error => {
      toast.error('Error verifying 2FA')
    }
  })

  const handleLoginSuccess = token => {
    Cookies.set('access_token', JSON.stringify(token))
    toast.success('Login successful!')
    setTimeout(() => {
      router.push('/')
    }, 100)
    // setTimeout(() => {
    //   setIs2FARequired(false);
    // }, 1000);
  }

  const onSubmit = data => {
    is2FARequired ? verify2FAMutation.mutate(data) : loginMutation.mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {is2FARequired ? (
        <>
          <AuthInput
            type='text'
            placeholder='Enter 2FA Code*'
            {...register('twoFACode', {
              required: '2FA code is required',
              validate: value => value.length === 6 || 'Code must be 6 digits'
            })}
            srcImg={icon2}
          />
          {errors.twoFACode && (
            <p style={{ color: '#B80505', marginBottom: '10px' }}>
              {errors.twoFACode.message}
            </p>
          )}

          <button
            type='submit'
            className='btn btn-primary'
            disabled={verify2FAMutation.isLoading}
          >
            {verify2FAMutation.isLoading ? 'Verifying...' : 'Verify 2FA'}
          </button>

          <button
            type='button'
            className='btn btn-secondary'
            onClick={() => {
              setIs2FARequired(false)
              tokenRef.current = null

              reset({
                login: '',
                password: ''
              }) // ✅ Only reset login form
            }}
            style={{ marginLeft: '10px' }}
          >
            Back to Login
          </button>
        </>
      ) : (
        <>
          <AuthInput
            type='text'
            placeholder='Login'
            {...register('login', {
              required: 'Login is required',
              minLength: {
                value: 3,
                message: 'Login should be at least 3 characters'
              }
            })}
            srcImg={icon2}
          />
          {errors.login && (
            <p style={{ color: '#B80505', marginBottom: '10px' }}>
              {errors.login.message}
            </p>
          )}

          <AuthInput
            type='password'
            placeholder='Password'
            {...register('password', {
              required: 'Password is required'
            })}
            srcImg={icon3}
          />
          {errors.password && (
            <p style={{ color: '#B80505', marginBottom: '10px' }}>
              {errors.password.message}
            </p>
          )}

          <button
            type='submit'
            className='btn btn-primary'
            disabled={loginMutation.isLoading}
          >
            {loginMutation.isLoading ? 'Signing in...' : 'Sign in'}
          </button>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Link
              href='/auth/sign-up'
              style={{ textDecoration: 'none', color: 'gray' }}
            >
              Don&apos;t have an account? Register
            </Link>
            <Link
              href='/auth/forget-password'
              style={{ textDecoration: 'none', color: 'gray' }}
            >
              Forget password
            </Link>
          </Box>
        </>
      )}
    </form>
  )
}
