import React from "react";
import { useLocation } from "react-router";
import LoadingSpinner from "../components/Shared/LoadingSpinner";
import useUserRole from "../hooks/useUserRole";
import useAuth from "../hooks/useAuth";

const SellerRoute = ({ children }) => {
	const { user, loading } = useAuth();
	const { isSeller, roleLoading } = useUserRole();
	const location = useLocation();

	if (loading || roleLoading) return <LoadingSpinner />;
	if (user && isSeller) return children;

	return <Navigate to="/dashboard" state={{ from: location }} replace />;
};

export default SellerRoute;
