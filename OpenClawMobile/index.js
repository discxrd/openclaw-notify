/**
 * @format
 */

import { AppRegistry } from "react-native";
import messaging from "@react-native-firebase/messaging";
import notifee from "@notifee/react-native";
import App from "./App";
import { name as appName } from "./app.json";

// Background Handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
	console.log("Message handled in the background!", remoteMessage);
	const { type, title, body, uuid, callerName } = remoteMessage.data || {};

	if (type === "notification") {
		// Ensure channel exists
		await notifee.createChannel({
			id: "default",
			name: "Default Channel",
			importance: 4, // High
		});

		await notifee.displayNotification({
			title: title || "OpenClaw",
			body: body || "",
			android: {
				channelId: "default",
			},
		});
	} else if (type === "call") {
		// Wakes up the app with Full Screen UI
		const {
			displayIncomingCall,
		} = require("./src/services/IncomingCallService");
		displayIncomingCall(
			uuid,
			callerName || "OpenClaw Agent",
			remoteMessage.data,
		);
	}
});

AppRegistry.registerComponent(appName, () => App);
