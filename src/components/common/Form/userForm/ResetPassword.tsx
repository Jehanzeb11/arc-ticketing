'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import AuthInput from '@/components/common/Input/AuthInput'
import toast from 'react-hot-toast'
import axios from 'axios'
import Cookies from 'js-cookie'
import ShowPasswordIcon from '@/assets/icons/auth/eyeIcon.svg'

const baseUrl = process.env.BASE_URL

export default function ResetPassword () {
  const router = useRouter()

  return (
    <form
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        marginBottom: '20px'
      }}
    >
      <AuthInput
        type='password'
        placeholder='New Password'
        className='pri-border'
      />
      <AuthInput
        type='password'
        placeholder='Confirm Password'
        className='pri-border'
      />

      {/* <button type='submit' className='btn btn-primary'>
        Resend OTP
      </button> */}
    </form>
  )
}
