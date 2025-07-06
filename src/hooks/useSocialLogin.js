import toast from "react-hot-toast";
import useAuth from "./useAuth"; // তুমি আগে থেকেই এটা ব্যবহার করছো ধরে নিচ্ছি
import { useNavigate } from "react-router";
import axios from "axios";

const useSocialLogin = () => {
	const { signInWithGoogle } = useAuth(); // তোমার কাস্টম authContext থেকে
	const navigate = useNavigate();

	const handleGoogleSignIn = async () => {
		try {
			// 1. Google Sign-in
			const result = await signInWithGoogle();
			const user = result.user;

			const userInfo = {
				name: user.displayName,
				email: user.email,
				image: user.photoURL,
				role: ["customer"],
				created_at: new Date().toISOString(),
				last_login_time: new Date().toISOString(),
			};

			// 2. Send user info to server (create or update)
			const res = await axios.post(`${import.meta.env.VITE_API_URL}/users`, userInfo, {
				withCredentials: true,
			});

			// 3. If user already exists, update last_login_time
			if (res.data.existing) {
				await axios.patch(
					`${import.meta.env.VITE_API_URL}/users/${user.email}`,
					{ last_login_time: new Date().toISOString() },
					{ withCredentials: true }
				);
			}

			// 4. Get JWT token and set in cookies
			await axios.post(`${import.meta.env.VITE_API_URL}/jwt`, { email: user.email }, { withCredentials: true });

			// 5. Navigate and toast
			toast.success("Login Successful!");
			navigate("/");
		} catch (err) {
			console.error("Google SignIn Error:", err);
			toast.error(err?.message || "Google login failed");
		}
	};

	// ভবিষ্যতে Facebook বা GitHub login এড করতে পারো নিচের মতো করে:
	/*
	const handleGithubSignIn = async () => { ... }
	const handleFacebookSignIn = async () => { ... }
	*/

	return {
		handleGoogleSignIn,
		// handleGithubSignIn, // future
		// handleFacebookSignIn, // future
	};
};

export default useSocialLogin;
