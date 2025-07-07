import React from "react";
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const OrderChart = ({ adminStats }) => {
	const chartData = adminStats?.dayWiseOrders || [];

	return (
		<div className="w-full h-[500px] bg-white p-4 rounded-lg shadow">
			<h2 className="text-lg font-semibold mb-4">Orders & Revenue Overview</h2>

			<ResponsiveContainer width="100%" height="100%">
				<BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="date" />
					<YAxis />
					<Tooltip />
					<Legend />
					<Bar
						dataKey="totalOrders"
						fill="#8884d8"
						name="Total Orders"
						activeBar={<Rectangle fill="lightblue" stroke="blue" />}
					/>
					<Bar
						dataKey="revenue"
						fill="#82ca9d"
						name="Revenue"
						activeBar={<Rectangle fill="lightgreen" stroke="green" />}
					/>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
};

export default OrderChart;
