"use client";
import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import Image from "next/image";
import BackIcon from "@/assets/icons/users/backIcon.svg";
import React from "react";
import { useRouter } from "next/navigation";
import EditUserTabs from "./EditUserTabs";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useApiStore } from "@/lib/api/apiStore";

function EditUser({ userId }) {
  const router = useRouter();

  const { callApi, fetchUserById, updateUser }: any = useApiStore();

  // Fetch user data
  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => callApi(fetchUserById, userId),
    enabled: !!userId,
  });

  // Update user mutation
  const mutation = useMutation({
    mutationFn: (data) =>
      callApi(updateUser, userId, data, {}, null, {
        headers: { "X-Request-Source": "EditUserForm" },
      }),
    onSuccess: () => {
      toast.success("User updated successfully!");
    },
    onError: (error) => toast.error("Failed to update user: " + error.message),
  });

  const handleUpdate = (data, onSuccessCallback) => {
    mutation.mutate(data, {
      onSuccess: () => {
        if (onSuccessCallback) onSuccessCallback();
      },
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress sx={{ color: "var(--pri-color)" }} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Error: {error.message}</Alert>;
  }

  return (
    <>
      <Box className="edit-user-header">
        <Box sx={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button onClick={() => router.back()}>
            <Image src={BackIcon} alt="" />
          </button>
          <h2>
            Portal user <span>{userData?.user_name || "HGHF"}</span>
          </h2>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <span>Status</span>
          <Typography sx={{ fontWeight: "500" }}>
            {userData?.user_status || "Active"}
          </Typography>
        </Box>
      </Box>
      <EditUserTabs
        userId={userId}
        userData={userData}
        onUpdate={handleUpdate}
      />
    </>
  );
}

export default EditUser;
