"use client";
import { Box, Grid, Typography, Alert } from "@mui/material";
import React, { use, useRef, useState } from "react";
import Image from "next/image";
import placeholderImg from "@/assets/images/profile/placeholder.png";
import GlobalInput from "@/components/common/Input/GlobalInput";
import Button from "@/components/common/Button/Button";
import MyModal from "@/components/common/Modal";
import ResetPassword from "@/components/common/Form/userForm/ResetPassword";
import LogoutIcon from "@/assets/icons/modal/deleteModalIcon.svg";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiStore } from "@/lib/api/apiStore";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { imageUrl } from "@/lib/constants/variables";
import { Controller } from "react-hook-form";
import FormSelect from "@/components/common/Select";
import { usePermission } from "@/hooks/usePermission";

export default function AdminProfilePage({ title }) {
  const [profilePicture, setProfilePicture] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("");
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  const canManageProfile = usePermission("Manage Own Profile");
  const canResetPassword = usePermission("Reset Own Password");

  // Get logged-in user's email from cookie
  const token = Cookies.get("access_token");

  // Access the fetchAdminProfile, updateUser, and callApi from the Zustand store
  const {
    fetchAdminProfile,
    updateUser,
    callApi,
    updateProfile,
    fetchRoles,
  }: any = useApiStore();

  // Fetch all users and find the logged-in user's profile
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: () => callApi(fetchAdminProfile),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const { data: roles } = useQuery({
    queryKey: ["roles"],
    queryFn: () => callApi(fetchRoles, { requestType: "getAllRoles" }),
  });

  // Find the logged-in user's profile

  // Populate form fields when profileData is available
  React.useEffect(() => {
    if (user) {
      setName(user.full_name || "");
      setEmail(user.email || "");
      setPhoneNumber(user.phone || "");
      setRole(user.roleId || "");
      if (user.picture) {
        setProfilePicture(user.picture);
      }
    }
  }, [user]);

  // Handle profile picture upload
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicture(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input click
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  // Handle form submission with useMutation
  const updateMutation = useMutation({
    mutationFn: (updatedData) => callApi(updateUser, user?.id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Profile updated successfully!");
    },
    onError: (error) => {
      toast.error("Failed to update profile: " + error.message);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      toast.error("No user profile found to update");
      return;
    }
    const updatedData: any = {
      user_name: name,
      user_email: email,
      user_phone: phoneNumber,
      user_role: role,
    };
    updateMutation.mutate(updatedData);
  };

  // Handle Change Password button click
  const handleChangePasswordClick = () => {
    setChangePasswordModalOpen(true);
  };

  // Handle modal cancel
  const handleChangePasswordCancel = () => {
    setChangePasswordModalOpen(false);
  };

  // Handle modal confirm
  // const handleChangePasswordConfirm = () => {
  //   setChangePasswordModalOpen(false);
  //   toast.success("Password change request submitted!");
  // };

  const updateProfileMutation = useMutation({
    mutationFn: async (DATA: any) => {
      return callApi(updateProfile, {
        requestType: "changePassword",
        oldPassword: DATA.currentPassword,
        newPassword: DATA.newPassword,
        confirmPassword: DATA.confirmPassword,
      });
    },
    onSuccess: () => {
      toast.success("Password changed successfully!");
    },
    onError: (error) => {
      toast.error("Failed to change password: " + error.message);
    },
  });

  const onSubmit = (DATA: any) => {
    console.log(DATA);
    updateProfileMutation.mutate(DATA);
  };

  if (error) {
    return <Alert severity="error">Error: {error.message}</Alert>;
  }

  if (!token) {
    return <Alert severity="error">Error: User not logged in</Alert>;
  }

  return (
    <>
      <div className="general-tabs-container main-admin-profile">
        <Typography
          variant="body1"
          color="initial"
          sx={{
            color: "#000",
            fontSize: "30px",
            fontWeight: 700,
            lineHeight: "27px",
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body1"
          color="initial"
          sx={{
            color: "#555",
            fontSize: "18px",
            lineHeight: "27px",
          }}
        >
          Manage your personal details.
        </Typography>
        <form className="profile-form" onSubmit={handleSubmit}>
          <Grid container spacing={2} alignItems="center">
            <Box display="flex" alignItems="center" gap={2} mt="30px">
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  backgroundColor: profilePicture ? "transparent" : "#EFEFEF",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {profilePicture ? (
                  <Image
                    src={imageUrl + profilePicture}
                    alt="Profile"
                    width={120}
                    height={120}
                    style={{ objectFit: "cover", borderRadius: "50%" }}
                    onClick={handleAvatarClick}
                  />
                ) : (
                  <Box
                    width={155}
                    height={155}
                    sx={{ borderRadius: "50%", backgroundColor: "#EFEFEF" }}
                  />
                )}
              </Box>
              <Box>
                <Typography
                  variant="body1"
                  color="initial"
                  sx={{
                    color: "#555",
                    fontSize: "20px",
                    lineHeight: "27px",
                    mb: 2,
                  }}
                >
                  Change Profile Picture
                </Typography>
                <Box
                  onClick={handleAvatarClick}
                  sx={{
                    borderRadius: "11px",
                    border: "1px solid #00000015",
                    padding: "12px 50px",
                    background: "#CECECE15",
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                >
                  <Typography
                    variant="body2"
                    color="initial"
                    sx={{ color: "#757575" }}
                  >
                    Choose File {profilePicture ? "Change" : "No file chosen"}
                  </Typography>
                </Box>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  style={{ display: "none" }}
                />
              </Box>
            </Box>

            <Grid
              container
              size={{ xs: 12 }}
              spacing={3}
              sx={{
                padding: "60px 83px",
                borderRadius: "16.631px",
                background: "#3F8CFF08",
                marginTop: "50px",
              }}
            >
              <Grid size={{ xs: 12, lg: 6 }} sx={{ mb: "40px" }}>
                <GlobalInput
                  label="Full Name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="primary-border"
                />
              </Grid>
              <Grid size={{ xs: 12, lg: 6 }}>
                <GlobalInput
                  label="Email Address"
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="primary-border"
                />
              </Grid>
              <Grid size={{ xs: 12, lg: 6 }}>
                <GlobalInput
                  label="Phone Number"
                  type="tel"
                  name="phoneNumber"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="primary-border"
                />
              </Grid>
              {/* <Grid size={{ xs: 12, lg: 6 }}>
                <GlobalInput
                  label="Role"
                  type="text"
                  name="role"
                  placeholder="Enter your role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="primary-border"
                />
              </Grid> */}

              <Grid size={{ lg: 6, xs: 12 }}>
                <FormSelect
                  label="Role"
                  name="role"
                  defaultText="Select Role"
                  className="no-border-select"
                  value={role || ""}
                  onChange={(e) => setRole(e.target.value)}
                  options={roles?.map((role) => ({
                    value: role.role_id,
                    label: role.role_name,
                  }))}
                />
              </Grid>
            </Grid>

            <Grid
              size={{ xs: 12, lg: 6 }}
              sx={{
                display: "flex",
                gap: "20px",
                mt: "40px",
                // marginInline: "auto",
              }}
            >
              {canResetPassword && <Button
                type="button"
                text="Change Password"
                btntrasnparent
                onClick={handleChangePasswordClick}
              />}
              {canManageProfile && <Button type="submit" text="Save Changes" />}
            </Grid>
          </Grid>
        </form>
      </div>

      <MyModal
        open={changePasswordModalOpen}
        setOpen={setChangePasswordModalOpen}
        customStyle="md-modal"
        modalHeader="true"
        modalTitle="Password Change"
        iconSrc={LogoutIcon}
      >
        <ResetPassword
          setChangePasswordModalOpen={setChangePasswordModalOpen}
          onSubmit={onSubmit}
        />
      </MyModal>
    </>
  );
}
