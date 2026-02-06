export const saveToken = async (
	token: string,
	serverUrl: string,
	deviceId: string,
) => {
	try {
		// Ensure URL doesn't have trailing slash for consistency
		const cleanUrl = serverUrl.replace(/\/$/, "");
		const response = await fetch(`${cleanUrl}/register`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ token, deviceId }),
		});

		if (!response.ok) {
			throw new Error(`Server returned ${response.status}`);
		}

		const data = await response.json();
		console.log("Registration response:", data);
		return data;
	} catch (error) {
		console.error("Failed to register token:", error);
		throw error;
	}
};
