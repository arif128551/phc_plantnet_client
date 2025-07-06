import { useQuery } from "@tanstack/react-query";
import UserDataRow from "../../../components/Dashboard/TableRows/UserDataRow";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import UpdateUserRole from "../../../components/Modal/UpdateUserRole";
import { useState } from "react";

const ManageUsers = () => {
	const axiosSecure = useAxiosSecure();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);

	const {
		data: users = [],
		isPending,
		refetch,
	} = useQuery({
		queryKey: ["all-users"],
		queryFn: async () => {
			const res = await axiosSecure.get("/users");
			return res.data;
		},
	});

	const handleOpenModal = (user) => {
		setSelectedUser(user);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setSelectedUser(null);
		setIsModalOpen(false);
	};

	if (isPending) return <LoadingSpinner />;
	return (
		<>
			<div className="container mx-auto px-4 sm:px-8">
				<div className="py-8">
					<div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
						<div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
							<table className="min-w-full leading-normal">
								<thead>
									<tr>
										<th
											scope="col"
											className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
										>
											Email
										</th>
										<th
											scope="col"
											className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
										>
											Role
										</th>
										<th
											scope="col"
											className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
										>
											Status
										</th>

										<th
											scope="col"
											className="px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal"
										>
											Action
										</th>
									</tr>
								</thead>
								<tbody>
									{users.map((user) => (
										<UserDataRow key={user._id} user={user} onUpdateClick={handleOpenModal} />
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
			{isModalOpen && selectedUser && (
				<UpdateUserRole user={selectedUser} isOpen={isModalOpen} onClose={handleCloseModal} refetch={refetch} />
			)}
		</>
	);
};

export default ManageUsers;
