"use client";

import Image from "next/image";
import smallLogo from "@/assets/images/auth/auth-logo.svg";
import authBg from "@/assets/images/auth/auth-bg.png";
import authFormBg from "@/assets/images/auth/auth-form-bg.png";
import { Grid } from "@mui/material";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/common/Form/userForm/Login";
import ForgetPassword from "@/components/common/Form/userForm/ForgetPassword";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
interface LoginProps {
  onLogin: () => void;

  redirectSignUp: () => void;
}

const Login: React.FC<LoginProps> = () => {
  const router = useRouter();
  return (
    <div className="main_authing">
      <Grid container sx={{ height: "100%" }}>
        <Grid
          size={{ xs: 12, lg: 6 }}
          sx={{
            position: "relative",
            height: "100%",
            backgroundImage: `url(${authFormBg.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <button
            onClick={() => router.push("/auth/login")}
            className="back-btn"
          >
            <ArrowBackIcon /> Back to Login
          </button>
          <div className="auth_form">
            <div className="logo">
              <Image src={smallLogo} alt="Small Logo" className="img-fluid" />
            </div>
            <h3 className="heading-4">Forget Password</h3>
            <ForgetPassword />
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
