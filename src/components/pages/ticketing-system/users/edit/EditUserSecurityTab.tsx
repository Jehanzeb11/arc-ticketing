// import React from 'react'
// import Image from 'next/image'
// import { Box, Grid, IconButton, Tooltip } from '@mui/material'
// import Button from '@/components/common/Button/Button'
// import GlobalInput from '@/components/common/Input/GlobalInput'
// import InfoIcon from '@/assets/icons/modal/info.svg'
// import AddIcon from '@/assets/icons/users/AddIcon.svg'
// import deleteIcon from '@/assets/icons/users/deleteIcon.svg'
// import { styled, Switch, SwitchProps } from '@mui/material'
// import IOSSwitch from '@/components/common/switch'

// function EditUserSecurityTab () {
//   return (
//     <Box className='edit-user-security-tab'>
//       <Box
//         sx={{
//           borderBottom: '1px solid #00000020 !important',
//           paddingBottom: '23px'
//         }}
//       >
//         <Grid
//           size={{ xs: 12 }}
//           sx={{
//             display: 'flex',
//             alignItems: 'center',
//             gap: '30px',
//             marginBottom: '30px'
//           }}
//         >
//           {/* ✅ iOS Switch here */}
//           <IOSSwitch defaultChecked />
//           <h3>Two-factor authentication (2FA)</h3>
//           <Tooltip title='Info'>
//             <IconButton>
//               <Image src={InfoIcon} alt='Info' />
//             </IconButton>
//           </Tooltip>{' '}
//         </Grid>
//         <Button type='button' text='Reset 2FA Key' />
//       </Box>
//       <Box>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
//           <h3>Allow access from IP address/network </h3>
//           <Tooltip title='Info'>
//             <IconButton>
//               <Image src={InfoIcon} alt='Info' />
//             </IconButton>
//           </Tooltip>{' '}
//         </Box>
//         <GlobalInput type='number' label='IP address' placeholder='Type Here' />
//         <Button type='button' text='Add IP' icon={AddIcon} />
//       </Box>
//       <Grid size={{ xs: 12 }} sx={{ mt: '55px' }}>
//         <Box
//           sx={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center'
//           }}
//         >
//           <Box sx={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
//             <Button type='button' text='Cancel' btntrasnparent={true} />
//             <Button type='submit' text='Save Changes' />
//           </Box>
//           <Button btnDelete={true} text='Delete' icon={deleteIcon} />
//         </Box>
//       </Grid>
//     </Box>
//   )
// }

// export default EditUserSecurityTab

import React from 'react'
import Image from 'next/image'
import { Box, Grid, IconButton, Tooltip } from '@mui/material'
import Button from '@/components/common/Button/Button'
import GlobalInput from '@/components/common/Input/GlobalInput'
import InfoIcon from '@/assets/icons/modal/info.svg'
import deleteIcon from '@/assets/icons/users/deleteIcon.svg'
import { styled, Switch } from '@mui/material'
import IOSSwitch from '@/components/common/switch'
import { useForm, FieldValues } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useApiStore } from '@/lib/api/apiStore'
import AddIcon from "@mui/icons-material/Add";

function EditUserSecurityTab ({ userId, userData, onUpdate }) {
  const { callApi, updateUser }: any = useApiStore()
  const {
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm({
    defaultValues: userData || {}
  })

  const mutation = useMutation({
    mutationFn: (data: FieldValues) =>
      callApi(
        updateUser,
        userId,
        {
          two_factor_auth: data.twoFactorAuth,
          ip_address: data.ipAddress
        },
        {},
        null,
        { headers: { 'X-Request-Source': 'EditUserSecurityForm' } }
      ),
    onSuccess: () => {
      // toast.success('Security settings updated successfully!')
      // Optionally call onUpdate if needed
    },
    onError: error =>
      toast.error('Failed to update security settings: ' + error.message)
  })

  const onSubmit = data => mutation.mutate(data)

  return (
    <Box className='edit-user-security-tab'>
      <Box
        sx={{
          borderBottom: '1px solid #00000020 !important',
          paddingBottom: '23px'
        }}
      >
        <Grid
          size={{ xs: 12 }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '30px',
            marginBottom: '30px'
          }}
        >
          <IOSSwitch
            {...register('twoFactorAuth')}
            defaultChecked={userData?.two_factor_auth}
          />
          <h3>Two-factor authentication (2FA)</h3>
          <Tooltip title='Info'>
            <IconButton>
              <Image src={InfoIcon} alt='Info' />
            </IconButton>
          </Tooltip>
        </Grid>
        <Button type='button' text='Reset 2FA Key' />
      </Box>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <h3>Allow access from IP address/network </h3>
          <Tooltip title='Info'>
            <IconButton>
              <Image src={InfoIcon} alt='Info' />
            </IconButton>
          </Tooltip>
        </Box>
        <GlobalInput
          type='text'
          label='IP address'
          placeholder='Type Here'
          {...register('ipAddress')}
        />
       <Button text="Add IP" libIcon={<AddIcon />} />
      </Box>
      <Grid size={{ xs: 12 }} sx={{ mt: '55px' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Box sx={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <Button type='button' text='Cancel' btntrasnparent={true} />
            <Button
              type='submit'
              text='Save Changes'
              disabled={isSubmitting}
              onClick={handleSubmit(onSubmit)}
            />
          </Box>
          <Button btnDelete={true} text='Delete' icon={deleteIcon} />
        </Box>
      </Grid>
    </Box>
  )
}

export default EditUserSecurityTab
