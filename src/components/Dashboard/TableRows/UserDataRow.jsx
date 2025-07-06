const UserDataRow = ({ user, onUpdateClick }) => {
	const { email, role, status } = user;
	return (
		<tr>
			<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
				<p className="text-gray-900 whitespace-no-wrap">{email}</p>
			</td>
			<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
				<p className="text-gray-900 whitespace-no-wrap capitalize">{role}</p>
			</td>
			<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
				{status ? (
					<>
						<p
							className={`text-gray-700 whitespace-no-wrap badge ${
								status === "verified" ? "badge-success" : "badge-info"
							}`}
						>
							{status}
						</p>
					</>
				) : (
					<>
						<p className="text-gray-700 whitespace-no-wrap ">Unavailable</p>
					</>
				)}
			</td>
			<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
				<button
					onClick={() => onUpdateClick(user)}
					className="relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight"
				>
					<span className="absolute inset-0 bg-green-200 opacity-50 rounded-full" />
					<span className="relative">Update Role</span>
				</button>
				{/* <UpdateUserModal /> */}
			</td>
		</tr>
	);
};

export default UserDataRow;
