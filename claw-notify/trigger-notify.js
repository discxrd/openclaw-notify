const deviceId = process.argv[2] || "android-main";

const triggerNotify = async () => {
	const response = await fetch("http://localhost:3000/notify", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			text: "This is a test notification from OpenClaw!",
			deviceId: deviceId,
		}),
	});
	const data = await response.text();
	console.log("Response:", data);
};

triggerNotify();
