import { DashboardLayout } from "../../components/layouts/DashboardLayout";
import RBACManagementPage from "./rbac";

const RBACPage = () => {
  return (
    <DashboardLayout>
      <RBACManagementPage />
    </DashboardLayout>
  );
};
export default RBACPage;
