'use client'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthInput from '@/components/common/Input/AuthInput'
import icon1 from '@/assets/icons/auth/icon1.svg'
import icon2 from '@/assets/icons/auth/icon2.svg'
import icon3 from '@/assets/icons/auth/icon3.svg'
import icon4 from '@/assets/icons/auth/icon4.svg'
import { Checkbox, FormControlLabel } from '@mui/material'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import { FieldValues, useForm } from 'react-hook-form'
import Link from 'next/link'
import { useMutation } from '@tanstack/react-query'
import { useApiStore } from '@/lib/api/apiStore'

export default function UserSignUpForm () {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm()
  const router = useRouter()
  const password = watch('password')
  const { callApi, createUser }: any = useApiStore()

  useEffect(() => {
    const userData = Cookies.get('userData')
    if (userData) {
      router.replace('/auth/login')
    }
  }, [router])

  const mutation = useMutation({
    mutationFn: (data: FieldValues) =>
      callApi(
        createUser,
        {
          user_name: data.username,
          user_phone: data.phone,
          user_password: data.password,
          user_email: data.email,
          user_company: data.companyName,
          user_role: data.role || 'user',
          user_status: data.status || 'pending'
        },
        {},
        null,
        { headers: { 'X-Request-Source': 'SignUpForm' } }
      ),
    onSuccess: () => {
      toast.success('Sign-up successful!')
      router.push('/auth/login')
    },
    onError: error => toast.error('Sign-up failed: ' + error.message)
  })

  const onSubmit = data => mutation.mutate(data)

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <AuthInput
        type='text'
        placeholder='User Name*'
        srcImg={icon4}
        {...register('username', {
          required: 'User Name is required',
          minLength: {
            value: 3,
            message: 'User Name should be at least 3 characters'
          }
        })}
      />
      {errors.username && (
        <p style={{ color: '#B80505', marginBottom: '10px' }}>
          {errors.username.message as React.ReactNode}
        </p>
      )}
      <AuthInput
        type='text'
        placeholder='Company Name*'
        srcImg={icon4}
        {...register('companyName', {
          required: 'Company Name is required',
          minLength: {
            value: 3,
            message: 'Company Name should be at least 3 characters'
          }
        })}
      />
      {errors.companyName && (
        <p style={{ color: '#B80505', marginBottom: '10px' }}>
          {errors.companyName.message as React.ReactNode}
        </p>
      )}
      <AuthInput
        type='text'
        placeholder='Phone Number*'
        srcImg={icon1}
        {...register('phone', {
          required: 'Phone Number is required',
          minLength: {
            value: 11,
            message: 'Phone Number should be at least 11 digits'
          },
          pattern: {
            value: /^[0-9]+$/,
            message: 'Phone Number must contain only digits'
          }
        })}
      />
      {errors.phone && (
        <p style={{ color: '#B80505', marginBottom: '10px' }}>
          {errors.phone.message as React.ReactNode}
        </p>
      )}
      <AuthInput
        type='email'
        placeholder='Email Address*'
        srcImg={icon2}
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Invalid email'
          }
        })}
      />
      {errors.email && (
        <p style={{ color: '#B80505', marginBottom: '10px' }}>
          {errors.email.message as React.ReactNode}
        </p>
      )}
      <AuthInput
        type='password'
        placeholder='Password'
        srcImg={icon3}
        {...register('password', {
          required: 'Password is required',
          minLength: {
            value: 8,
            message: 'Password must be at least 8 characters'
          },
          maxLength: {
            value: 32,
            message: 'Password must be less than 32 characters'
          }
        })}
      />
      {errors.password && (
        <p style={{ color: '#B80505', marginBottom: '10px' }}>
          {errors.password.message as React.ReactNode}
        </p>
      )}
      <AuthInput
        type='password'
        placeholder='Confirm Password'
        srcImg={icon3}
        {...register('confirmPassword', {
          required: 'Confirm Password is required',
          validate: value => value === password || 'Passwords do not match'
        })}
      />
      {errors.confirmPassword && (
        <p style={{ color: '#B80505', marginBottom: '10px' }}>
          {errors.confirmPassword.message as React.ReactNode}
        </p>
      )}
      <div className='checkbox'>
        <FormControlLabel
          control={
            <Checkbox
              {...register('rememberMe', {
                required: 'You must agree to the terms and conditions'
              })}
            />
          }
          label='By continuing, you agree to ARC Sip Terms of Use and Privacy Policy.'
        />
      </div>
      {errors.rememberMe && (
        <p style={{ color: '#B80505', marginBottom: '10px' }}>
          {errors.rememberMe.message as React.ReactNode}
        </p>
      )}
      <button type='submit' className='btn btn-primary' disabled={isSubmitting}>
        {isSubmitting ? 'Signing Up...' : 'Sign Up'}
      </button>
      <button type='button' style={{ border: 'none', marginTop: '10px' }}>
        <Link
          href='/auth/login'
          style={{ textDecoration: 'none', color: 'gray' }}
        >
          Already have an account? Login
        </Link>
      </button>
    </form>
  )
}
