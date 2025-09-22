'use client'
import { Box, Grid, Typography, Alert } from '@mui/material'
import React, { useRef, useState } from 'react'
import Image from 'next/image'
import placeholderImg from '@/assets/images/profile/placeholder.png'
import GlobalInput from '@/components/common/Input/GlobalInput'
import Button from '@/components/common/Button/Button'
import MyModal from '@/components/common/Modal'
import ResetPassword from '@/components/common/Form/userForm/ResetPassword'
import LogoutIcon from '@/assets/icons/modal/deleteModalIcon.svg'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useApiStore } from '@/lib/api/apiStore'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import { usePermission } from '@/hooks/usePermission'

export default function AdminProfilePage ({ title }) {
  const [profilePicture, setProfilePicture] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [companyAddress, setCompanyAddress] = useState('')
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false)
  const fileInputRef = useRef(null)
  const queryClient = useQueryClient()

  // Get logged-in user's email from cookie
  const userData = Cookies.get('userData')
  const loggedInEmail = userData ? JSON.parse(userData).user_email : null

  // Access the fetchCompanyProfile, updateCompanyProfile, and callApi from the Zustand store
  const { fetchCompanyProfile, updateCompanyProfile, callApi }: any =
    useApiStore()

  // Fetch company profile
  const {
    data: companyProfile,
    isLoading,
    error
  } = useQuery({
    queryKey: ['companyProfile'],
    queryFn: () => callApi(fetchCompanyProfile),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity
  })

  // Find the company profile data (assuming single company profile)
  const profileData =
    companyProfile && companyProfile.length > 0 ? companyProfile[0] : null

  // Populate form fields when profileData is available
  React.useEffect(() => {
    if (profileData) {
      setName(profileData.company_name || '')
      setEmail(profileData.company_email || '')
      setPhoneNumber(profileData.company_phone || '')
      setCompanyAddress(profileData.company_address || '')
      // Note: Profile picture is not part of company_profile data; handle separately if needed
    }
  }, [profileData])

  // Handle profile picture upload
  const handleProfilePictureChange = e => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = e => {
        setProfilePicture(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Trigger file input click
  const handleAvatarClick = () => {
    fileInputRef.current.click()
  }

  // Handle form submission with useMutation
  const updateMutation = useMutation({
    mutationFn: updatedData =>
      callApi(updateCompanyProfile, profileData?.id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyProfile'] })
      toast.success('Company profile updated successfully!')
    },
    onError: error => {
      toast.error('Failed to update company profile: ' + error.message)
    }
  })

  // Handle form submission
  const handleSubmit = async e => {
    e.preventDefault()
    if (!profileData?.id) {
      toast.error('No company profile found to update')
      return
    }
    const updatedData = {
      company_name: name,
      company_email: email,
      company_phone: phoneNumber,
      company_address: companyAddress,
      // Include profilePicture if the API supports it
      ...(profilePicture && { profile_picture: profilePicture })
    }
    updateMutation.mutate(updatedData)
  }

  // Handle Change Password button click
  const handleChangePasswordClick = () => {
    setChangePasswordModalOpen(true)
  }

  // Handle modal cancel
  const handleChangePasswordCancel = () => {
    setChangePasswordModalOpen(false)
  }

  // Handle modal confirm
  const handleChangePasswordConfirm = () => {
    setChangePasswordModalOpen(false)
    toast.success('Password change request submitted!')
  }

  if (error) {
    return <Alert severity='error'>Error: {error.message}</Alert>
  }

  if (!loggedInEmail) {
    return <Alert severity='error'>Error: User not logged in</Alert>
  }

  if (!profileData) {
    return <Alert severity='error'>Error: Company profile not found</Alert>
  }

  return (
    <>
      <div className='general-tabs-container main-admin-profile'>
        <Typography
          variant='body1'
          color='initial'
          sx={{
            color: '#000',
            fontSize: '30px',
            fontWeight: 500,
            mb: '10px',
            lineHeight: '27px'
          }}
        >
          {title}
        </Typography>
        <Typography
          variant='body1'
          color='initial'
          sx={{
            color: '#555',
            fontSize: '18px',
            lineHeight: '27px'
          }}
        >
          Manage your company’s general details.
        </Typography>
        <form className='profile-form' onSubmit={handleSubmit}>
          <Grid container spacing={2} alignItems='center'>
            <Box display='flex' alignItems='center' gap={2} mt='30px'>
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  backgroundColor: profilePicture ? 'transparent' : '#EFEFEF',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {profilePicture ? (
                  <Image
                    src={profilePicture}
                    alt='Profile'
                    width={120}
                    height={120}
                    style={{ objectFit: 'cover', borderRadius: '50%' }}
                    onClick={handleAvatarClick}
                  />
                ) : (
                  <Box
                    width={155}
                    height={155}
                    sx={{ borderRadius: '50%', backgroundColor: '#EFEFEF' }}
                  />
                )}
              </Box>
              <Box>
                <Typography
                  variant='body1'
                  color='initial'
                  sx={{
                    color: '#555',
                    fontSize: '20px',
                    lineHeight: '27px',
                    mb: 2
                  }}
                >
                  Change Profile Picture
                </Typography>
                <Box
                  onClick={handleAvatarClick}
                  sx={{
                    borderRadius: '11px',
                    border: '1px solid #00000015',
                    padding: '12px 50px',
                    background: '#CECECE15',
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#f5f5f5' }
                  }}
                >
                  <Typography
                    variant='body2'
                    color='initial'
                    sx={{ color: '#757575' }}
                  >
                    Choose File {profilePicture ? 'Change' : 'No file chosen'}
                  </Typography>
                </Box>
                <input
                  type='file'
                  ref={fileInputRef}
                  accept='image/*'
                  onChange={handleProfilePictureChange}
                  style={{ display: 'none' }}
                />
              </Box>
            </Box>

            <Grid
              container
              size={{ xs: 12 }}
              spacing={3}
              sx={{
                padding: '60px 83px',
                borderRadius: '16.631px',
                background: '#3F8CFF08',
                marginTop: '50px'
              }}
            >
              <Grid size={{ xs: 12, lg: 6 }} sx={{ mb: '40px' }}>
                <GlobalInput
                  label='Company Name'
                  type='text'
                  name='name'
                  placeholder='Enter company name'
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className='primary-border'
                />
              </Grid>
              <Grid size={{ xs: 12, lg: 6 }}>
                <GlobalInput
                  label='Company Email'
                  type='email'
                  name='email'
                  placeholder='Enter company email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className='primary-border'
                />
              </Grid>
              <Grid size={{ xs: 12, lg: 6 }}>
                <GlobalInput
                  label='Company Phone Number'
                  type='tel'
                  name='phoneNumber'
                  placeholder='Enter company phone number'
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  className='primary-border'
                />
              </Grid>
              <Grid size={{ xs: 12, lg: 6 }}>
                <GlobalInput
                  label='Company Address'
                  type='text'
                  name='companyAddress'
                  placeholder='Enter company address'
                  value={companyAddress}
                  onChange={e => setCompanyAddress(e.target.value)}
                  className='primary-border'
                />
              </Grid>
            </Grid>

             {usePermission("Reset Own Password") && <Grid
              size={{ xs: 12, lg: 6 }}
              sx={{
                display: 'flex',
                gap: '20px',
                mt: '40px',
                marginInline: 'auto'
              }}
            >
              <Button
                type='button'
                text='Change Password'
                btntrasnparent
                onClick={handleChangePasswordClick}
              />
              <Button type='submit' text='Save Changes' />
            </Grid>}
          </Grid>
        </form>
      </div>

      <MyModal
        open={changePasswordModalOpen}
        setOpen={setChangePasswordModalOpen}
        customStyle='md-modal'
        modalHeader='true'
        modalTitle='Password Change'
        iconSrc={LogoutIcon}
      >
        <ResetPassword />
        <div className='md-modal-btns'>
          <Button
            type='button'
            text='Cancel'
            btntrasnparent={true}
            onClick={handleChangePasswordCancel}
          />
          <Button
            type='button'
            btnDelete={true}
            text='Change Password'
            onClick={handleChangePasswordConfirm}
          />
        </div>
      </MyModal>
    </>
  )
}
