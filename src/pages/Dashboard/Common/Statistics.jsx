import { useQuery } from "@tanstack/react-query";
import AdminStatistics from "../../../components/Dashboard/Statistics/AdminStatistics";
import { axiosSecure } from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
const Statistics = () => {
	const {
		isPending,
		error,
		data: adminStats,
	} = useQuery({
		queryKey: ["admin-stats"],
		queryFn: () => axiosSecure(`${import.meta.env.VITE_API_URL}/admin-stats`),
		select: (res) => res.data,
	});
	if (isPending) return <LoadingSpinner />;
	return (
		<div>
			<AdminStatistics adminStats={adminStats} />
		</div>
	);
};

export default Statistics;
