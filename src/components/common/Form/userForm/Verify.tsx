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
import { createGuest } from "@/lib/api/apiCalls";

export default function VerifyForm() {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm();
  const router = useRouter();
  const { callApi, emailToVerify }: any = useApiStore();
  console.log(emailToVerify, "emailToVerify");

  const loginMutation = useMutation({
    mutationFn: async (data: FieldValues) => {
      return callApi(createGuest, {
        requestType: "verifyOtp",
        email: emailToVerify,
        otp: +data.otp,
      });
    },
    onSuccess: (data) => {
      toast.success("Verification successful!");

      router.push("/auth/login");
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
        type="number"
        placeholder="Enter OTP*"
        {...register("otp", {
          required: "OTP is required",
          minLength: {
            value: 6,
            message: "OTP should be at least 6 characters",
          },
        })}
        srcImg={icon2}
      />
      {errors.otp && (
        <p style={{ color: "#B80505", marginBottom: "10px" }}>
          {errors.otp.message as React.ReactNode}
        </p>
      )}

      <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
        {isSubmitting ? "Verifying..." : "verify"}
      </button>
    </form>
  );
}
