const deviceId = process.argv[2] || "android-main";

const triggerCall = async () => {
	const response = await fetch("http://localhost:3000/call", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			deviceId: deviceId,
		}),
	});
	const data = await response.json();
	console.log("Response:", data);
};

triggerCall();
