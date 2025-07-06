import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import CheckoutForm from "../Form/CheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const PurchaseModal = ({ closeModal, isOpen, plantDetails, refetch }) => {
	const [orderQuantity, setOrderQuantity] = useState(1);
	if (!isOpen) return null;
	const {
		name = "Unknown Plant",
		category = "Unknown",
		price = 0,
		quantity = 0,
		image,
		seller = {},
	} = plantDetails || {};

	const totalPrice = orderQuantity && !isNaN(orderQuantity) ? price * orderQuantity : 0;

	const handleQuantityChange = (e) => {
		const inputValue = e.target.value;

		if (inputValue === "") {
			setOrderQuantity(""); // allow empty for now
			return;
		}

		const value = parseInt(inputValue);
		if (isNaN(value)) {
			setOrderQuantity(1);
		} else if (value > quantity) {
			setOrderQuantity(quantity);
		} else if (value < 1) {
			setOrderQuantity(1);
		} else {
			setOrderQuantity(value);
		}
	};

	// const handleOrder = () => {
	// 	console.log("Purchasing", { ...plantDetails, orderQuantity, totalPrice });
	// 	closeModal();
	// };
	return (
		<Dialog open={isOpen} as="div" className="relative z-10 focus:outline-none" onClose={closeModal}>
			<div className="fixed inset-0 z-10 w-screen bg-black/25 backdrop-blur-sm overflow-y-auto">
				<div className="flex min-h-full items-center justify-center p-4">
					<DialogPanel className="w-full max-w-xl bg-white p-6 shadow-xl rounded-2xl">
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
								<span className="font-medium">Price:</span> $ {price} / per unit
							</li>
							<li>
								<span className="font-medium">Available Quantity:</span> {quantity}
							</li>
						</ul>
						{/* Quantity Input */}
						<div className="mt-4">
							<label className="block text-sm font-medium text-gray-700 mb-1">Enter Quantity to Buy:</label>
							<input
								type="number"
								min="1"
								max={quantity}
								value={orderQuantity}
								onChange={handleQuantityChange}
								onInput={(e) => {
									// Prevent negative and non-number chars
									if (e.target.value < 0) e.target.value = "";
								}}
								className="w-full border px-3 py-2 rounded-md outline-lime-400"
							/>
							{orderQuantity > quantity && (
								<p className="text-sm text-red-500 mt-1">You can't buy more than available stock.</p>
							)}
						</div>
						{/* Total Price */}
						<div className="mt-2 font-medium text-gray-800 mb-2">
							Total Price: <span className="text-green-600">${totalPrice.toFixed(2)}</span>
						</div>
						{/* payments */}
						<Elements stripe={stripePromise}>
							<CheckoutForm
								totalPrice={totalPrice}
								orderQuantity={orderQuantity}
								plantDetails={plantDetails}
								closeModal={closeModal}
								refetch={refetch}
							/>
						</Elements>
						{/* Action Buttons */}
						<div className="mt-6 flex justify-end gap-3">
							<button
								onClick={closeModal}
								className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
							>
								Cancel
							</button>
							{/* <button
								onClick={handleOrder}
								disabled={orderQuantity > quantity}
								className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400"
							>
								Order Now
							</button> */}
						</div>
					</DialogPanel>
				</div>
			</div>
		</Dialog>
	);
};

export default PurchaseModal;
