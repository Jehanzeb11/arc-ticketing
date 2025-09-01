import DefaultLayout from "@/components/layout/DefaultLayout";
import CreateRolesPermissions from "@/components/pages/ticketing-system/roles-permission/Create-Roles-Permissions";
import React from "react";

const page = () => {
  return (
    <DefaultLayout>
      <CreateRolesPermissions />
    </DefaultLayout>
  );
};

export default page;
