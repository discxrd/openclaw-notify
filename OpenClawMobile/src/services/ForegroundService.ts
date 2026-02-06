import notifee from "@notifee/react-native";

export async function startCallForeground() {
	// Channel required for Android 8+
	const channelId = await notifee.createChannel({
		id: "call_channel",
		name: "Ongoing Calls",
		importance: 4, // HIGH
	});

	await notifee.displayNotification({
		id: "ongoing-call",
		title: "Call in Progress",
		body: "Connected to OpenClaw",
		android: {
			channelId,
			asForegroundService: true, // Critical for Mic stability
			ongoing: true,
			actions: [
				{
					title: "Hangup",
					pressAction: {
						id: "hangup",
					},
				},
			],
		},
	});
}

export async function stopCallForeground() {
	await notifee.stopForegroundService();
}
