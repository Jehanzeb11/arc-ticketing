"use client";
import { Box, Grid, Typography, LinearProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ButtonCustom from "@/components/common/Button/Button";
import GlobalInput from "@/components/common/Input/GlobalInput";
import GlobalPasswordInput from "@/components/common/Input/GlobalPasswordInput";
import FormSelect from "@/components/common/Select";
import { useApiStore } from "@/lib/api/apiStore";
import IOSSwitch from "../../switch";

export default function AddNewEntryEmailConf({ getall, onCloseModal }: any) {
  const { callApi, createSMTP, fetchRoles, fetchDepartments }: any =
    useApiStore();

  // 🔹 Local state for password strength
  const [strength, setStrength] = useState<"Weak" | "Medium" | "Strong">(
    "Weak"
  );
  const [strengthScore, setStrengthScore] = useState(0);

  // Fetch roles and departments
  const { data: roles } = useQuery({
    queryKey: ["roles"],
    queryFn: () => callApi(fetchRoles, { requestType: "getAllRoles" }),
  });

  const {
    data: departments,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: () =>
      callApi(fetchDepartments, {
        requestType: "getAllDepartments",
      }),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      host: "",
      port: "",
      email: "",
      password: "",
      dept: "",
      status: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const object = {
        requestType: "createSMTP",
        host: data.host,
        port: data.port,
        username: data.email,
        password: data.password,
        dept: data.dept,
        secure: data.status ? "SSL" : "TLS",
        type: "SMTP",
      };
      return callApi(createSMTP, object);
    },
    onSuccess: () => {
      toast.success("User created successfully!");
      getall();
      onCloseModal();
      reset();
    },
    onError: (error) => toast.error(`Failed to create user: ${error.message}`),
  });

  const onSubmit = (data: any) => mutation.mutate(data);

  // 🔹 Password strength calculation
  const password = watch("password");
  useEffect(() => {
    const calcStrength = (value: string) => {
      let score = 0;
      if (!value) return { text: "Weak", score: 0 };

      if (value.length >= 8) score++;
      if (/[A-Z]/.test(value)) score++;
      if (/[0-9]/.test(value)) score++;
      if (/[^A-Za-z0-9]/.test(value)) score++;

      if (score <= 1) return { text: "Weak", score: 33 };
      if (score === 2) return { text: "Medium", score: 66 };
      return { text: "Strong", score: 100 };
    };

    const result = calcStrength(password);
    setStrength(result.text as "Weak" | "Medium" | "Strong");
    setStrengthScore(result.score);
  }, [password]);

  // Options
  const roleOptions =
    roles?.map((role) => ({
      label: role.role_name,
      value: role.role_id,
    })) || [];

  // const departmentOptions =
  //   departments?.map((dept) => ({
  //     label: dept.name,
  //     value: dept.id,
  //   })) || [];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        {/* Full Name */}
        <Grid size={{ xs: 6 }}>
          <GlobalInput
            type="text"
            placeholder="Type Here"
            label="SMTP Host"
            {...register("host", { required: "SMTP Host is required" })}
          />
          {errors.host && (
            <Typography variant="caption" color="error" sx={{ mt: -1, ml: 1 }}>
              {errors.host.message}
            </Typography>
          )}
        </Grid>

        {/* Email */}
        <Grid size={{ xs: 6 }}>
          <GlobalInput
            type="text"
            label="SMTP Port"
            {...register("port", {
              required: "SMTP Port is required",
            })}
          />
          {errors.port && (
            <Typography variant="caption" color="error" sx={{ mt: -1, ml: 1 }}>
              {errors.port.message}
            </Typography>
          )}
        </Grid>
        <Grid size={{ xs: 6 }}>
          <GlobalInput
            type="email"
            label="Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <Typography variant="caption" color="error" sx={{ mt: -1, ml: 1 }}>
              {errors.email.message}
            </Typography>
          )}
        </Grid>

        {/* Password */}
        <Grid size={{ xs: 6 }}>
          <GlobalPasswordInput
            name="password"
            label="Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
          />
          {errors.password && (
            <Typography variant="caption" color="error" sx={{ mt: -1, ml: 1 }}>
              {errors.password.message}
            </Typography>
          )}
        </Grid>

        {/* 🔹 Password Strength Indicator */}
        {password && (
          <Grid size={{ xs: 12 }}>
            <Typography
              variant="body1"
              sx={{
                fontSize: "15px",
                fontWeight: 500,
                color:
                  strength === "Weak"
                    ? "red"
                    : strength === "Medium"
                    ? "orange"
                    : "green",
              }}
            >
              Strength: {strength}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={strengthScore}
              sx={{
                height: 6,
                borderRadius: 2,
                mt: 0.5,
                "& .MuiLinearProgress-bar": {
                  backgroundColor:
                    strength === "Weak"
                      ? "red"
                      : strength === "Medium"
                      ? "orange"
                      : "green",
                },
              }}
            />
          </Grid>
        )}

        {/* Status */}
        <Grid size={{ xs: 12 }}>
          <Controller
            name="dept"
            control={control}
            rules={{ required: "Department is required" }}
            render={({ field }) => (
              <FormSelect
                label="Assign to Department"
                name="dept"
                defaultText="Select Department"
                className="modal-select"
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                options={departments?.map((dept) => ({
                  label: dept.name,
                  value: dept.id,
                }))}
              />
            )}
          />
          {errors.status && (
            <Typography variant="caption" color="error" sx={{ mt: -1, ml: 1 }}>
              {errors.status.message}
            </Typography>
          )}
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Controller
            name="status"
            control={control}
            defaultValue="Inactive"
            render={({ field }) => (
              <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <IOSSwitch
                  checked={field.value === "Active"}
                  onChange={(e) =>
                    field.onChange(e.target.checked ? "Active" : "Inactive")
                  }
                />
                <Typography
                  sx={{
                    color: "#000000b8",
                    fontSize: "15px",
                    lineHeight: "20px",
                    padding: "4px 12px",
                    borderRadius: "100px",
                  }}
                >
                  TLS/SSL
                </Typography>
              </Box>
            )}
          />
        </Grid>
      </Grid>

      {/* Footer Buttons */}
      <Box sx={{ display: "flex", gap: "15px", mt: "35px" }}>
        <ButtonCustom
          text="Reset SMTP"
          btntrasnparent={true}
          onClick={onCloseModal}
        />
        <ButtonCustom
          text={isSubmitting ? "Saving..." : "Save SMTP"}
          type="submit"
          disabled={isSubmitting}
        />
      </Box>
    </form>
  );
}
