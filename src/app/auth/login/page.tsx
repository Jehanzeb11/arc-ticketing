// 'use client'
import Image from 'next/image'
import smallLogo from '@/assets/images/auth/auth-logo.svg'
import authBg from '@/assets/images/auth/auth-bg.png'
import authFormBg from '@/assets/images/auth/auth-form-bg.png'
import { Grid, Typography } from '@mui/material'
// import { useRouter } from "next/navigation";
import LoginForm from '@/components/common/Form/userForm/Login'
import LoginForm2 from '@/components/common/Form/userForm/Login2'
interface LoginProps {
  onLogin: () => void

  redirectSignUp: () => void
}

const Login: React.FC<LoginProps> = () => {
  // const router = useRouter();
  return (
    <div className='main_authing'>
      <Grid container sx={{ height: '100%' }}>
        <Grid
          size={{ xs: 12, lg: 6 }}
          sx={{
            position: 'relative',
            height: '100%',
            backgroundImage: `url(${authFormBg.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* <button onClick={() => router.back()} className="back-btn">
            back
          </button> */}
          <div className='auth_form'>
            <div className='logo'>
              <Image src={smallLogo} alt='Small Logo' className='img-fluid' />
            </div>
            <Typography fontSize={25} color='#404040' fontWeight={600} my={1.5}>
              Login Now
            </Typography>
            <Typography
              fontSize={15}
              color='rgba(0, 0, 0, .6)'
              fontWeight={300}
              mb={2}
            >
              Please fullfill the following requirements to change your
              password.
            </Typography>
            {/* <LoginForm /> */}
            <LoginForm2 />
          </div>
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <div className='auth-img-parent'>
            <div className='auth-bg'>
              <Image
                src={authBg}
                alt='Auth Background'
                className='img-fluid'
                style={{
                  height: '100vh',
                  width: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default Login
