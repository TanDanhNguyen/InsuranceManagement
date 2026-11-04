
import { Navigate, Route, Routes } from "react-router-dom";
import CustomersPage from "../features/customers/pages/CustomersPage";
import InsurancePoliciesPage from "../features/policies/pages/InsurancePoliciesPage";
import InsuranceProductsPage from "../features/products/pages/InsuranceProductsPage";

import MainLayout from "../components/layout/MainLayout";
import DashboardPage from "../features/dashboard/pages/DashboardPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/policies" element={<InsurancePoliciesPage />} />
        <Route path="/insurance-products" element={<InsuranceProductsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
