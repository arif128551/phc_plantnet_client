import React from "react";
import { Navigate, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";
import useUserRole from "../hooks/useUserRole";
import LoadingSpinner from "../components/Shared/LoadingSpinner";

const AdminRoute = ({ children }) => {
	const { user, loading } = useAuth();
	const { isAdmin, roleLoading } = useUserRole();
	const location = useLocation();

	if (loading || roleLoading) return <LoadingSpinner />;

	// ✅ Check if user is logged in and isAdmin
	if (user && isAdmin) return children;
	// ✅ Redirect if not admin or not logged in
	return <Navigate to="/dashboard" state={{ from: location }} replace={true} />;
};

export default AdminRoute;
