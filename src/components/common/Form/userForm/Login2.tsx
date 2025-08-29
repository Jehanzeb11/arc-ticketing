'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AuthInput from '@/components/common/Input/AuthInput'
import icon2 from '@/assets/icons/auth/icon2.svg'
import icon3 from '@/assets/icons/auth/icon3.svg'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import Link from 'next/link'
import { Box } from '@mui/material'
import { FieldValues, useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { useApiStore } from '@/lib/api/apiStore'

export default function LoginForm2 () {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset
  } = useForm()
  const router = useRouter()
  const { callApi, fetchUsers }: any = useApiStore()

  const [userEmail, setUserEmail] = useState('')
  const [users, setUsers] = useState([])
  const [matchedUser, setMatchedUser] = useState(null)

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await callApi(fetchUsers)
        setUsers(response || [])
      } catch (error) {
        console.log('Error fetching users:', error)
      }
    }
    loadUsers()
  }, [callApi, fetchUsers])

  const loginMutation = useMutation({
    mutationFn: (data: FieldValues) => Promise.resolve(data),
    onSuccess: data => {
      const user = users.find(
        u => u.user_email === data.email && u.user_password === data.password
      )
      if (user) {
        setUserEmail(data.email)
        setMatchedUser(user)
        reset()
        Cookies.set('userData', JSON.stringify(user), { expires: 7 })
        toast.success('Login successful!')
        router.push('/tickets')
      } else {
        toast.error('Invalid email or password')
      }
    },
    onError: error => {
      console.log('Login Error:', error)
      toast.error('Invalid email or password')
    }
  })

  const onSubmit = data => loginMutation.mutate(data)

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <AuthInput
        type='email'
        placeholder='Email Address*'
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Invalid email'
          }
        })}
        srcImg={icon2}
      />
      {errors.email && (
        <p style={{ color: '#B80505', marginBottom: '10px' }}>
          {errors.email.message as React.ReactNode}
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
          {errors.password.message as React.ReactNode}
        </p>
      )}
      <Link
        href='/auth/forget-password'
        style={{
          textDecoration: 'none',
          color: 'gray',
          fontSize: '14px',
          display: 'flex',
          justifyContent: 'flex-end'
        }}
      >
        Forget password
      </Link>
      <button type='submit' className='btn btn-primary' disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>

      <Link
        href='/auth/sign-up'
        style={{
          textDecoration: 'none',
          color: 'gray',
          fontSize: '14px',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        Don't have an account? Signup
      </Link>
    </form>
  )
}
