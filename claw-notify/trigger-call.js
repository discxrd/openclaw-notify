const deviceId = process.argv[2] || "android-main";
const message = process.argv[3] || "Привет, это проверка связи";
const callbackUrl = process.argv[4] || "";

const triggerCall = async () => {
	console.log(`Triggering call for ${deviceId} with message: "${message}"`);
	const body = {
		deviceId: deviceId,
		message: message,
	};
	if (callbackUrl) {
		body.callbackUrl = callbackUrl;
	}

	const response = await fetch("http://localhost:3000/call", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});
	const data = await response.json();
	console.log("Response:", data);
};

triggerCall();
