import DefaultLayout from "@/components/layout/DefaultLayout";
import SMTP from "@/components/pages/ticketing-system/smtp-configuration";

const page = () => {
  return (
    <DefaultLayout>
      <SMTP />
    </DefaultLayout>
  );
};

export default page;
