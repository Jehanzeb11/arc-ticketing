import React, { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthInput from "@/components/common/Input/AuthInput";
import icon1 from "@/assets/icons/auth/icon1.svg";
import icon2 from "@/assets/icons/auth/icon2.svg";
import icon3 from "@/assets/icons/auth/icon3.svg";
import icon4 from "@/assets/icons/auth/icon4.svg";
import { Checkbox, FormControlLabel, Grid } from "@mui/material";
import toast from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";
import Icon1 from "@/assets/icons/social-icons/google-icon.svg";
import Icon2 from "@/assets/icons/social-icons/microsoft.svg";
import Icon3 from "@/assets/icons/social-icons/email.svg";
import Link from "next/link";
import Image from "next/image";

export default function UserSignUpForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const userData = Cookies.get("userData");

    console.log("Checking userData:", userData); // Debugging

    if (userData) {
      router.replace("/");
    }
  }, []);
  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password!");
      return;
    }
    toast.success("Login Successful!");
    if (rememberMe) {
      const userData = { email, password };
      Cookies.set("userData", JSON.stringify(userData));
    }
    setTimeout(() => {
      router.push("/");
    }, 500);
  };
  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <div className="sign_up_social">
            <Link href="">
              <Image src={Icon1} alt="" /> Continue with Google
            </Link>
          </div>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <div className="sign_up_social">
            <Link href="">
              <Image src={Icon2} alt="" /> Continue with Microsoft
            </Link>
          </div>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <div className="sign_up_social">
            <Link href="/auth/sign-up">
              <Image src={Icon3} alt="" /> Continue with Email
            </Link>
          </div>
        </Grid>
      </Grid>
      <div className="checbox sign_up_social">
        <FormControlLabel
          control={
            <Checkbox
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
          }
          label="By continuing, you agree to ARC Sip Terms of Use and Privacy Policy."
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Already have an account? Log in
      </button>
    </form>
  );
}
