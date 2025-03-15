import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/common/Sidebar";
import OverviewPage from "./pages/OverviewPage";
import ProductsPage from "./pages/ProductsPage";
import UsersPage from "./pages/UsersPage";
import SalesPage from "./pages/SalesPage";
import OrdersPage from "./pages/OrdersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import WelcomePage from "./pages/WelcomePage";
import DetectPage from "./pages/Brain/DetectPage";
import DetectPage2 from "./pages/Mammogram/DetectPage";
import AnalysisPage from "./pages/Brain/AnalysisPage";
import VisualizePage from "./pages/VisualizePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import toast, { Toaster } from 'react-hot-toast';
import EditProfilePage from "./pages/EditProfilePage";
import { useEffect, useState } from "react";
import PatientPage from "./pages/PatientPage";


const TheApp = () => {
    return ( 
        <>
        <Sidebar />
      <Routes>
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/" element={<WelcomePage />} />
        <Route path="/brain/detect" element={<DetectPage />} />
        <Route path="/breast/detect" element={<DetectPage2 />} />
        <Route path="/brain/grade" element={<AnalysisPage />} />
        <Route path="/visualize" element={<VisualizePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<SettingsPage />} />
        <Route path="/editprofile" element={<EditProfilePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/patient/:pid" element={<PatientPage />} />
      </Routes>
        </>
     );
}
 
export default TheApp;