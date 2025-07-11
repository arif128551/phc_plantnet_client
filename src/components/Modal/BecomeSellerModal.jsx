import { Dialog, DialogTitle, DialogPanel } from "@headlessui/react";
import useAuth from "../../hooks/useAuth";
import { axiosSecure } from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const BecomeSellerModal = ({ closeModal, isOpen }) => {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const { mutate: requestSeller, isPending } = useMutation({
		mutationFn: async () => {
			const res = await axiosSecure.patch(`/users/request-seller/${user.email}`);
			return res.data;
		},
		onSuccess: (data) => {
			if (data.success) {
				Swal.fire("Request Sent!", data.message, "success");
				queryClient.invalidateQueries(["current-user"]); // 🔁 optional: if you cache current user
				closeModal();
			} else {
				Swal.fire("Info", data.message, "info");
			}
		},
		onError: (error) => {
			console.error(error);
			Swal.fire("Error", "Could not send request", "error");
		},
	});
	return (
		<Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none " onClose={close}>
			<div className="fixed inset-0 z-10 w-screen overflow-y-auto">
				<div className="flex min-h-full items-center justify-center p-4">
					<DialogPanel
						transition
						className="w-full max-w-md bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0 shadow-xl rounded-2xl"
					>
						<DialogTitle as="h3" className="text-lg font-medium text-center leading-6 text-gray-900">
							Become A Seller!
						</DialogTitle>
						<div className="mt-2">
							<p className="text-sm text-gray-500">Please read all the terms & conditions before becoming a seller.</p>
						</div>
						<hr className="mt-8 " />
						<div className="flex mt-2 justify-around">
							<button
								type="button"
								onClick={() => requestSeller()}
								disabled={isPending}
								className="inline-flex justify-center rounded-md bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none"
							>
								{isPending ? "Requesting..." : "Continue"}
							</button>
							<button
								type="button"
								className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
								onClick={closeModal}
							>
								Cancel
							</button>
						</div>
					</DialogPanel>
				</div>
			</div>
		</Dialog>
	);
};

export default BecomeSellerModal;
