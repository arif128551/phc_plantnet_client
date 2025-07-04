import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

const PurchaseModal = ({ closeModal, isOpen, plantDetails }) => {
	if (!isOpen) return null;
	const {
		name = "Unknown Plant",
		category = "Unknown",
		price = 0,
		quantity = 0,
		image,
		seller = {},
	} = plantDetails || {};
	return (
		<Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={closeModal}>
			<div className="fixed inset-0 z-10 w-screen bg-black/25 backdrop-blur-sm overflow-y-auto">
				<div className="flex min-h-full items-center justify-center p-4">
					<DialogPanel
						transition
						className="w-full max-w-md bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0 shadow-xl rounded-2xl"
					>
						<DialogTitle as="h3" className="text-lg font-semibold text-center text-gray-900 mb-4">
							Review Info Before Purchase
						</DialogTitle>

						<div className="flex justify-center mb-4">
							<img src={image} alt={name} className="w-32 h-32 object-cover rounded-lg shadow" />
						</div>

						<ul className="text-sm text-gray-600 space-y-2">
							<li>
								<span className="font-medium">Plant:</span> {name}
							</li>
							<li>
								<span className="font-medium">Category:</span> {category}
							</li>
							<li>
								<span className="font-medium">Seller:</span> {seller.name || "Anonymous"}
							</li>
							<li>
								<span className="font-medium">Price:</span> $ {price}
							</li>
							<li>
								<span className="font-medium">Available Quantity:</span> {quantity}
							</li>
						</ul>

						{/* Actions (optional) */}
						<div className="mt-6 flex justify-end gap-3">
							<button
								onClick={closeModal}
								className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
							>
								Cancel
							</button>
							<button
								onClick={() => {
									console.log("Purchasing", plantDetails);
									closeModal();
								}}
								className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
							>
								Confirm
							</button>
						</div>
					</DialogPanel>
				</div>
			</div>
		</Dialog>
	);
};

export default PurchaseModal;
