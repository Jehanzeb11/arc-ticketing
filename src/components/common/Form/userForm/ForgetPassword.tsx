'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import AuthInput from '@/components/common/Input/AuthInput'
import toast from 'react-hot-toast'
import axios from 'axios'
import Cookies from 'js-cookie'

const baseUrl = process.env.BASE_URL

export default function ForgetPassword () {
  const router = useRouter()

  return (
    <form>
      <AuthInput type='email' placeholder='Enter your Email' />

      <button type='submit' className='btn btn-primary'>
        Send Link
      </button>
    </form>
  )
}
