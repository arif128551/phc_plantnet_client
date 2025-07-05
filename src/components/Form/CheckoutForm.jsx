import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth"; // যদি custom useAuth থাকে

const CheckoutForm = ({ orderQuantity, plantDetails, closeModal }) => {
	const stripe = useStripe();
	const elements = useElements();
	const { user } = useAuth(); // ✅ get logged-in user

	const [clientSecret, setClientSecret] = useState("");
	const [processing, setProcessing] = useState(false);

	const { _id: plantId, name, price, seller } = plantDetails || {};

	// Step 1: Create PaymentIntent
	useEffect(() => {
		if (!plantId || !orderQuantity) return;

		const createPaymentIntent = async () => {
			try {
				const res = await axios.post(`${import.meta.env.VITE_API_URL}/create-payment-intent`, {
					plantId,
					quantity: orderQuantity,
				});

				setClientSecret(res.data.clientSecret);
			} catch (error) {
				console.error("Payment Intent Error:", error);
				toast.error("Failed to initiate payment");
			}
		};

		createPaymentIntent();
	}, [plantId, orderQuantity]);

	// Step 2: Submit Payment
	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!stripe || !elements || !clientSecret) return;
		setProcessing(true);

		const card = elements.getElement(CardElement);
		const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
			payment_method: {
				card,
				billing_details: {
					name: user?.displayName || "Customer",
					email: user?.email || "unknown@email.com",
				},
			},
		});

		if (error) {
			console.error("Payment Error:", error);
			toast.error(error.message || "Payment failed");
			setProcessing(false);
			return;
		}

		if (paymentIntent.status === "succeeded") {
			toast.success("Payment successful!");
			console.log("💳 PaymentIntent:", paymentIntent);

			// 🟢 Prepare orderData → updated key: `plant` instead of `plantId`
			const orderInfo = {
				plantId, // ✅ Backend now expects this key
				plantName: name,
				customer: {
					name: user?.displayName || "Customer",
					email: user?.email,
					photo: user?.photoURL,
				},
				seller: {
					name: seller.name || "Seller",
					email: seller?.email,
					photo: seller?.photo,
				},
				quantity: orderQuantity,
				plantImage: plantDetails.image,
				price: parseInt(price),
				total: parseInt(price) * parseInt(orderQuantity),
				transactionId: paymentIntent.id,
				paid_at: new Date().toISOString(),
			};

			try {
				const orderRes = await axios.post(`${import.meta.env.VITE_API_URL}/orders`, orderInfo, {
					withCredentials: true,
				});
				if (orderRes.data.insertedId) {
					toast.success("Order placed successfully!");
					closeModal();
				}
			} catch (err) {
				console.error("Order Save Error:", err);
				toast.error("Payment done, but failed to save order!");
			} finally {
				setProcessing(false);
			}
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="max-w-full mx-auto bg-white shadow-md rounded-xl p-6 space-y-6 border border-gray-200"
		>
			<h2 className="text-xl font-semibold text-gray-700 text-center">Payment Details</h2>

			<div className="p-4 rounded-md border border-gray-300">
				<CardElement
					options={{
						style: {
							base: {
								fontSize: "16px",
								color: "#32325d",
								"::placeholder": { color: "#aab7c4" },
								fontFamily: "sans-serif",
							},
							invalid: { color: "#fa755a" },
						},
					}}
				/>
			</div>

			<button
				type="submit"
				disabled={!stripe || !clientSecret || processing}
				className={`w-full py-3 px-4 rounded-md text-white font-medium transition duration-200 ${
					processing ? "bg-gray-400 cursor-wait" : "bg-indigo-600 hover:bg-indigo-700"
				}`}
			>
				{processing ? (
					<span className="flex items-center justify-center gap-2">
						<span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
						Processing...
					</span>
				) : (
					`Pay Securely $${parseInt(price) * parseInt(orderQuantity)}`
				)}
			</button>
		</form>
	);
};

export default CheckoutForm;
