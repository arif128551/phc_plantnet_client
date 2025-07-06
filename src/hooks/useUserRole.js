import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

const useUserRole = () => {
	const axiosSecure = useAxiosSecure();
	const { user, loading } = useAuth();

	const { data: role = "", isPending } = useQuery({
		queryKey: ["user-role", user?.email],
		enabled: !!user?.email && !loading,
		queryFn: async () => {
			const res = await axiosSecure.get(`/users/role/${user.email}`);
			return res.data?.role || "customer";
		},
	});

	const isAdmin = role === "admin";
	const isSeller = role === "seller";
	const isCustomer = role === "customer";

	return { role, roleLoading: isPending, isAdmin, isSeller, isCustomer };
};

export default useUserRole;
