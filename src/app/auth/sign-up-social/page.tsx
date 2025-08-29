"use client";

import Image from "next/image";
import smallLogo from "@/assets/images/auth/logo.png";
import authBg from "@/assets/images/auth/auth-bg.png";

import { Grid } from "@mui/material";
import UserSignUpForm from "@/components/common/Form/userForm/SignUpSocial";

// Define the props interface
interface LoginProps {
  onLogin: () => void;

  redirectSignUp: () => void;
}

const Login: React.FC<LoginProps> = () => {
  return (
    <div className="main_authing">
      <Grid container>
        <Grid size={{ xs: 12, lg: 6 }}>
          <div className="auth_form">
            <div className="logo">
              <Image src={smallLogo} alt="Small Logo" className="img-fluid" />
            </div>
            <h3 className="heading-4">Create an account</h3>
            <UserSignUpForm />
          </div>
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <div className="auth-img-parent">
            <div className="auth-bg">
              <Image
                src={authBg}
                alt="Auth Background"
                className="img-fluid"
                style={{
                  height: "100vh",
                  width: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Login;
