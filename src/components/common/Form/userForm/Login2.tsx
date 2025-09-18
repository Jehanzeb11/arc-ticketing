"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthInput from "@/components/common/Input/AuthInput";
import icon2 from "@/assets/icons/auth/icon2.svg";
import icon3 from "@/assets/icons/auth/icon3.svg";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import Link from "next/link";
import { Box } from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useApiStore } from "@/lib/api/apiStore";
import { loginUser } from "@/lib/api/apiCalls";

export default function LoginForm2() {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm();
  const router = useRouter();
  const { callApi }: any = useApiStore();

  const loginMutation = useMutation({
    mutationFn: async (data: FieldValues) => {
      return callApi(loginUser, data);
    },
    onSuccess: (data) => {
      toast.success("Login successful!");
      Cookies.set("access_token", data.token, {
        secure: false,
        sameSite: "Lax",
      });
      Cookies.set("access_role", data.user_type, {
        secure: false,
        sameSite: "Lax",
      });
      data.user_type === "user"
        ? router.push("/ticketing-system/tickets")
        : data.user_type === "guest"
        ? router.push("/ticketing-system/guest/tickets")
        : router.push("/ticketing-system/guest/tickets");
    },
    onError: (err) => {
      console.error("Login error:", err);
      toast.error("Something went wrong");
    },
  });

  const onSubmit = (data) => {
    loginMutation.mutate(data);
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <AuthInput
        type="email"
        placeholder="Email Address*"
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Invalid email",
          },
        })}
        srcImg={icon2}
      />
      {errors.email && (
        <p style={{ color: "#B80505", marginBottom: "10px" }}>
          {errors.email.message as React.ReactNode}
        </p>
      )}
      <AuthInput
        type="password"
        placeholder="Password"
        {...register("password", {
          required: "Password is required",
        })}
        srcImg={icon3}
      />
      {errors.password && (
        <p style={{ color: "#B80505", marginBottom: "10px" }}>
          {errors.password.message as React.ReactNode}
        </p>
      )}
      <Link
        href="/auth/forget-password"
        style={{
          textDecoration: "none",
          color: "gray",
          fontSize: "14px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        Forgot password?
      </Link>
      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
        {isSubmitting ? "Logging in..." : "Login"}
      </button>

      <Link
        href="/auth/sign-up"
        style={{
          textDecoration: "none",
          color: "#404040",
          fontSize: "16px",
          display: "flex",
          justifyContent: "center",
          gap: "5px",
        }}
      >
        Don't have an account? <b>Signup</b>
      </Link>
    </form>
  );
}
