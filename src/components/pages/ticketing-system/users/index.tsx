"use client";

// React and Next.js imports
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Material-UI imports
import { Alert, Box, CircularProgress } from "@mui/material";

// Component imports
import UserHeader from "./UserHeader";
import ReusableTable from "@/components/common/Table/ReusableTable";
import MyModal from "@/components/common/Modal";
import NewUser from "@/components/common/Form/users/NewUser";
import Button from "@/components/common/Button/Button";
import TableFilter from "../../../pages/ticketing-system/users/UserTableFilter";

// Asset imports
import editIcon from "@/assets/icons/table/edit.svg";
import deleteIcon from "@/assets/icons/table/delete.svg";
import copyIcon from "@/assets/icons/table/copy.svg";
import NewUserIcon from "@/assets/icons/modal/add-user.svg";
import DeleteModalIcon from "@/assets/icons/modal/deleteModalIcon.svg";
import deleteModalDeleteIcon from "@/assets/icons/users/deleteIcon.svg";

// Store and Query imports
import { useApiStore } from "@/lib/api/apiStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
export default function Users() {
  const queryClient = useQueryClient();
  const { callApi, fetchUsers, deleteUser }: any = useApiStore();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const router = useRouter();

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => callApi(fetchUsers),
  });
  const columns = [
    { key: "Login", title: "Login", filterable: true },
    { key: "Status", title: "Status", filterable: true },
    { key: "Email", title: "Email", filterable: true },
    {
      key: "Role",
      title: "Role",
      filterable: true,
      filterType: "dropdown",
      filterOptions: [
        { value: "admin", label: "Admin" },
        { value: "user", label: "User" },
        { value: "guest", label: "Guest" },
      ],
    },
  ];
  const data =
    users?.map((user) => ({
      id: user.id,
      Login: user.user_name || "N/A",
      Status: (
        <span className="user-status">
          <span className="dot"></span>
          {user.user_status || "Active"}
        </span>
      ),
      Email: user.user_email || "N/A",
      Role: user.user_role || "N/A",
    })) || [];

  const actions = [
    {
      icon: editIcon,
      onClick: (row) => {
        if (row && row.id) {
          router.push(`/users/edit/${row.id}`);
        } else {
          toast.error("Invalid row or missing id:", row);
        }
      },
      className: "action-icon",
      tooltip: "Edit User",
    },
    {
      icon: deleteIcon,
      onClick: (row) => {
        if (row && row.id) {
          setSelectedUserId(row.id);
          setDeleteModal(true);
        } else {
          toast.error("Cannot delete: User data is invalid.");
        }
      },
      className: "action-icon",
      tooltip: "Delete User",
    },
  ];
  const deleteMutation = useMutation({
    mutationFn: (id) => callApi(deleteUser, id, {}, {}, null, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully.");
      setDeleteModal(false);
      setSelectedUserId(null);
    },
    onError: (error) => {
      toast.error("Failed to delete user: " + error.message);
    },
  });
  // if (isLoading) {
  //   return (
  //     <Box sx={{ display: "flex", justifyContent: "center" }}>
  //       <CircularProgress sx={{ color: "var(--pri-color)" }} />
  //     </Box>
  //   );
  // }

  if (error) {
    return <Alert severity="error">Error: {error.message}</Alert>;
  }
  return (
    <div>
      <UserHeader
        onClickModal={() => setAddModal(true)}
        userCount={users?.length}
      />
      <div className="table-parent">
        {/* <TableFilter /> */}
        <ReusableTable
          columns={columns}
          data={data}
          actions={actions}
          enableSorting={true}
          enablePagination={true}
          enableFiltering={true}
          enableRowSelection={false}
          pageSize={10}
          isLoading={isLoading}
        />
      </div>
      <MyModal
        open={addModal}
        setOpen={setAddModal}
        customStyle="user-modal"
        modalHeader="true"
        modalTitle="Add New Portal User"
        iconSrc={NewUserIcon}
      >
        <NewUser
          getall={() => queryClient.invalidateQueries({ queryKey: ["users"] })}
          onCloseModal={() => setAddModal(false)}
        />
      </MyModal>
      <MyModal
        open={deleteModal}
        setOpen={setDeleteModal}
        customStyle="delete-modal"
        modalHeader="true"
        modalTitle="Delete User"
        iconSrc={DeleteModalIcon}
      >
        <p>Are you sure you want to delete the Delete user "gcamus"?</p>
        <div className="delete-modal-btns">
          <Button
            type="button"
            text="Cancel"
            btntrasnparent={true}
            onClick={() => {
              setDeleteModal(false);
              setSelectedUserId(null);
            }}
          />
          <Button
            btnDelete={true}
            text={deleteMutation.isPending ? "Deleting..." : "Delete"}
            icon={deleteModalDeleteIcon}
            onClick={() => {
              if (selectedUserId) {
                deleteMutation.mutate(selectedUserId);
              }
            }}
          />
        </div>
      </MyModal>
    </div>
  );
}
