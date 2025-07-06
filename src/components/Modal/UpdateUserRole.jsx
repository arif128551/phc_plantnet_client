import { Dialog, DialogPanel, DialogTitle, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useMutation } from "@tanstack/react-query";

const UpdateUserRole = ({ user, isOpen, onClose, refetch }) => {
	const axiosSecure = useAxiosSecure();
	const [selectedRole, setSelectedRole] = useState(user.role);

	const { mutate: updateUserRole, isPending } = useMutation({
		mutationFn: async () => {
			return await axiosSecure.patch(`/users/role/${user._id}`, { role: selectedRole });
		},
		onSuccess: (res) => {
			if (res.data.modifiedCount > 0) {
				Swal.fire("Success", "Role updated successfully", "success");
				refetch();
				onClose();
			} else {
				Swal.fire("Info", "Nothing was updated", "info");
			}
		},
		onError: (error) => {
			console.error("Update failed:", error);
			Swal.fire("Error", "Failed to update role", "error");
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		updateUserRole(); // 🔥 this triggers the mutation
	};

	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog as="div" className="relative z-50" onClose={onClose}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-black bg-opacity-10" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-4 text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
								<DialogTitle className="text-lg font-medium leading-6 text-gray-900">
									Update Role for {user.email}
								</DialogTitle>

								<form onSubmit={handleSubmit} className="mt-4 space-y-4">
									<div>
										<label htmlFor="role" className="block text-sm font-medium text-gray-700">
											Select Role
										</label>
										<select
											id="role"
											value={selectedRole}
											onChange={(e) => setSelectedRole(e.target.value)}
											className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:outline-none focus:ring-blue-500 sm:text-sm"
										>
											<option value="customer">Customer</option>
											<option value="admin">Admin</option>
											<option value="seller">Seller</option>
										</select>
									</div>

									<div className="flex justify-end gap-3">
										<button
											type="button"
											onClick={onClose}
											className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
										>
											Cancel
										</button>
										<button
											type="submit"
											className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
										>
											{isPending ? "Updating..." : "Update"}
										</button>
									</div>
								</form>
							</DialogPanel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
};

export default UpdateUserRole;
