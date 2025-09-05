"use client";
import React from "react";
import { useRouter } from "next/navigation";
import AuthInput from "@/components/common/Input/AuthInput";
import toast from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";
import ShowPasswordIcon from "@/assets/icons/auth/eyeIcon.svg";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useApiStore } from "@/lib/api/apiStore";
import Button from "../../Button/Button";

const baseUrl = process.env.BASE_URL;

export default function ResetPassword({
  handleChangePasswordCancel,
  onSubmit,
}: any) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        marginBottom: "20px",
      }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <AuthInput
        type="password"
        placeholder="New Password"
        className="pri-border"
        {...register("currentPassword", {
          required: "New Password is required",
          minLength: {
            value: 6,
            message: "New Password should be at least 6 characters",
          },
        })}
      />
      {errors.newPassword && (
        <p style={{ color: "#B80505", margin: "0px" }}>
          {errors.newPassword.message as any}
        </p>
      )}
      <AuthInput
        type="password"
        placeholder="Current Password"
        className="pri-border"
        {...register("newPassword", {
          required: "Current Password is required",
        })}
      />
      {errors.currentPassword && (
        <p style={{ color: "#B80505", margin: "0px" }}>
          {errors.currentPassword.message as any}
        </p>
      )}
      <AuthInput
        type="password"
        placeholder="Confirm Password"
        className="pri-border"
        {...register("confirmPassword", {
          required: "Confirm Password is required",
          minLength: {
            value: 6,
            message: "Confirm Password should be at least 6 characters",
          },
        })}
      />
      {errors.confirmPassword && (
        <p style={{ color: "#B80505", margin: "0px" }}>
          {errors.confirmPassword.message as any}
        </p>
      )}
      <div style={{ height: "10px" }}></div>
      {/* Button Group */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginTop: "10px",
        }}
      >
        <Button
          type="button"
          text="Cancel"
          btntrasnparent={true}
          onClick={handleChangePasswordCancel}
        />
        <Button type="submit" btnDelete={true} text="Change Password" />
      </div>
      {/* <button type='submit' className='btn btn-primary'>
        Resend OTP
                })}
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
  );
}
