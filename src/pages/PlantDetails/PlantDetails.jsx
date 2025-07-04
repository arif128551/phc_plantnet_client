import Container from "../../components/Shared/Container";
import Heading from "../../components/Shared/Heading";
import Button from "../../components/Shared/Button/Button";
import PurchaseModal from "../../components/Modal/PurchaseModal";
import { useState } from "react";
import { useLoaderData } from "react-router";

const PlantDetails = () => {
	const plantDetails = useLoaderData();

	const { name, category, description, price, quantity, image, seller = {}, created_at } = plantDetails;

	const sellerName = seller.name || "Unknown Seller";
	const sellerEmail = seller.email || "No Email";
	const sellerPhoto = seller.photo || "https://i.ibb.co/KpDZqB1T/Chat-GPT-Image-Jun-25-2025-08-23-16-AM.png";

	let [isOpen, setIsOpen] = useState(false);

	const closeModal = () => {
		setIsOpen(false);
	};

	return (
		<Container>
			<div className="mx-auto flex flex-col lg:flex-row justify-between w-full gap-12">
				{/* Image */}
				<div className="flex flex-col gap-6 flex-1">
					<div>
						<div className="w-full overflow-hidden rounded-xl">
							<img className="object-cover w-full" src={image} alt={name} />
						</div>
					</div>
				</div>

				{/* Details */}
				<div className="md:gap-10 flex-1">
					{/* Plant Info */}
					<Heading title={name} subtitle={`Category: ${category}`} />
					<hr className="my-6" />
					<div className="text-lg font-light text-neutral-500">{description}</div>
					<hr className="my-6" />

					{/* Seller */}
					<div className="text-xl font-semibold flex flex-row items-center gap-2">
						<div>Seller: {sellerName}</div>
						<img
							className="rounded-full"
							height="30"
							width="30"
							alt="Avatar"
							referrerPolicy="no-referrer"
							src={sellerPhoto}
						/>
					</div>

					<hr className="my-6" />

					{/* Quantity */}
					<div>
						<p className="gap-4 font-light text-neutral-500">
							Quantity: {quantity} Unit{quantity > 1 ? "s" : ""} Left
						</p>
					</div>

					<hr className="my-6" />

					{/* Price and Purchase */}
					<div className="flex justify-between">
						<p className="font-bold text-3xl text-gray-500">Price: ${price}</p>
						<Button onClick={() => setIsOpen(true)} label="Purchase" />
					</div>

					<hr className="my-6" />

					<PurchaseModal closeModal={closeModal} isOpen={isOpen} plantDetails={plantDetails} />
				</div>
			</div>
		</Container>
	);
};

export default PlantDetails;
