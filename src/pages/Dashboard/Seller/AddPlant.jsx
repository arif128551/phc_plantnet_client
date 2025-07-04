import axios from "axios";
import AddPlantForm from "../../../components/Form/AddPlantForm";
import { imageUpload } from "../../../api/utils";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import { useState } from "react";

const AddPlant = () => {
	const { user } = useAuth();
	const [previewImage, setPreviewImage] = useState(null);
	const handleAddPlant = async (e) => {
		e.preventDefault();
		const form = e.target;
		const name = form?.name?.value;
		const category = form?.category?.value;
		const description = form?.description?.value;
		const price = form?.price?.value;
		const quantity = form?.quantity?.value;
		const image = form?.image?.files[0];

		if (!image) {
			toast.error("Upload image first");
			return;
		}

		const imageFormData = new FormData();
		imageFormData.append("image", image);
		const toastId = toast.loading("Uploading image...");
		const imageUrl = await imageUpload(imageFormData);
		const plantData = {
			name,
			category,
			description,
			price,
			quantity,
			image: imageUrl,
			seller: { name: user?.displayName, email: user?.email, photo: user?.photoURL },
			created_at: new Date().toISOString(),
		};
		// 🌿 toast update
		toast.loading("Adding plant...", { id: toastId });

		const res = await axios.post(`${import.meta.env.VITE_API_URL}/plants`, plantData);

		if (res.data.insertedId) {
			toast.success("✅ Plant added successfully!", { id: toastId });
			form.reset();
			setPreviewImage(null);
		}
	};
	return (
		<div>
			{/* Form */}
			<AddPlantForm handleAddPlant={handleAddPlant} previewImage={previewImage} setPreviewImage={setPreviewImage} />
		</div>
	);
};

export default AddPlant;
