import React, { useEffect, useState } from "react";
import {
	SafeAreaView,
	StatusBar,
	StyleSheet,
	Text,
	useColorScheme,
	View,
	Platform,
	Alert,
	TextInput,
	TouchableOpacity,
	ScrollView,
	ActivityIndicator,
} from "react-native";
import messaging from "@react-native-firebase/messaging";
import notifee, { AndroidImportance } from "@notifee/react-native";
import { request, PERMISSIONS } from "react-native-permissions";
import { saveToken } from "./src/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Clipboard from "@react-native-clipboard/clipboard";
import DeviceInfo from "react-native-device-info";

const DEFAULT_SERVER_URL = "http://10.0.2.2:3000"; // Default for Android Emulator

function App(): React.JSX.Element {
	const isDarkMode = useColorScheme() === "dark";
	const [status, setStatus] = useState("Initializing...");
	const [fcmToken, setFcmToken] = useState<string | null>(null);
	const [serverUrl, setServerUrl] = useState(DEFAULT_SERVER_URL);
	const [deviceId, setDeviceId] = useState("unknown-device");
	const [isRegistering, setIsRegistering] = useState(false);

	useEffect(() => {
		// Load persisted Server URL
		AsyncStorage.getItem("server_url").then((url) => {
			if (url) setServerUrl(url);
		});

		// Get Device ID
		DeviceInfo.getUniqueId().then((id) => {
			setDeviceId(id);
		});

		const requestPermissions = async () => {
			if (Platform.OS === "android") {
				// Request Microphone permission
				await request(PERMISSIONS.ANDROID.RECORD_AUDIO);

				// Request Notification permission (Android 13+)
				if (Platform.Version >= 33) {
					// @ts-ignore: POST_NOTIFICATIONS exists in newer permissions versions
					await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
				}

				// Create default notification channel
				await notifee.createChannel({
					id: "default",
					name: "Default Channel",
					importance: AndroidImportance.HIGH,
				});
			}
		};

		const initFCM = async () => {
			try {
				const authStatus = await messaging().requestPermission();
				const enabled =
					authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
					authStatus === messaging.AuthorizationStatus.PROVISIONAL;

				if (enabled) {
					const token = await messaging().getToken();
					console.log("FCM Token:", token);
					setFcmToken(token);
					setStatus("Connected to FCM");
					// Don't auto-save immediately, let user configure URL first
				} else {
					setStatus("FCM Permission Denied");
				}
			} catch (error) {
				console.error("FCM Initialization Error:", error);
				setStatus("FCM Error");
			}
		};

		requestPermissions().then(initFCM);

		// Foreground message handler
		const unsubscribe = messaging().onMessage(async (remoteMessage) => {
			const { type, title, body, uuid, callerName } =
				(remoteMessage.data as any) || {};

			if (type === "notification") {
				await notifee.displayNotification({
					title: (title as string) || "OpenClaw",
					body: (body as string) || "",
					android: {
						channelId: "default",
					},
				});
			} else if (type === "call") {
				const {
					displayIncomingCall,
				} = require("./src/services/IncomingCallService");
				displayIncomingCall(
					uuid,
					callerName || "OpenClaw Agent",
					remoteMessage.data,
				);
			} else {
				Alert.alert(
					remoteMessage.notification?.title || "Notification",
					remoteMessage.notification?.body || "New message received",
				);
			}
		});

		return unsubscribe;
	}, []);

	const handleCopyToken = () => {
		if (fcmToken) {
			Clipboard.setString(fcmToken);
			Alert.alert("Copied", "FCM Token copied to clipboard");
		}
	};

	const handleGenerateConfig = () => {
		if (!fcmToken) {
			Alert.alert("Error", "No FCM Token available yet");
			return;
		}

		// Clean URL for Markdown link
		const cleanUrl = serverUrl.replace(/\/$/, "");

		const markdown = `# OpenClaw Mobile Device
- **Device ID**: ${deviceId}
- **FCM Token**: ${fcmToken}
- **Audio Support**: 16kHz PCM
- **Actions**:
  - [Call Me](${cleanUrl}/call?deviceId=${deviceId})
  - [Notify Me](${cleanUrl}/notify?deviceId=${deviceId})`;

		Clipboard.setString(markdown);
		Alert.alert("Success", "Configuration copied to clipboard!");
	};

	const handleRegister = async () => {
		if (!fcmToken) {
			Alert.alert("Error", "No FCM Token to register");
			return;
		}
		if (!serverUrl) {
			Alert.alert("Error", "Please enter a Server URL");
			return;
		}

		setIsRegistering(true);
		try {
			await AsyncStorage.setItem("server_url", serverUrl);
			await saveToken(fcmToken, serverUrl, deviceId);
			Alert.alert("Success", "Device registered with server!");
		} catch (error) {
			Alert.alert("Registration Failed", String(error));
		} finally {
			setIsRegistering(false);
		}
	};

	const backgroundStyle = {
		backgroundColor: isDarkMode ? "#111827" : "#F3F4F6",
		flex: 1,
	};

	const textStyle = {
		color: isDarkMode ? "#E5E7EB" : "#1F2937",
	};

	const inputStyle = {
		backgroundColor: isDarkMode ? "#374151" : "#FFFFFF",
		color: isDarkMode ? "#F9FAFB" : "#111827",
		borderColor: isDarkMode ? "#4B5563" : "#D1D5DB",
	};

	return (
		<SafeAreaView style={backgroundStyle}>
			<StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				keyboardShouldPersistTaps="handled"
			>
				<View style={styles.header}>
					<Text style={[styles.title, textStyle]}>OpenClaw Mobile</Text>
					<View style={styles.statusBadge}>
						<View
							style={[
								styles.statusDot,
								status.includes("Connected")
									? styles.statusDotConnected
									: styles.statusDotDisconnected,
							]}
						/>
						<Text style={[styles.statusText, textStyle]}>{status}</Text>
					</View>
				</View>

				<View style={[styles.card, isDarkMode && styles.cardDark]}>
					<Text style={[styles.label, textStyle]}>Server URL</Text>
					<TextInput
						style={[styles.input, inputStyle]}
						value={serverUrl}
						onChangeText={setServerUrl}
						placeholder="http://192.168.1.x:3000"
						placeholderTextColor={isDarkMode ? "#9CA3AF" : "#6B7280"}
						autoCapitalize="none"
						autoCorrect={false}
					/>
					<Text style={styles.hint}>
						Must be reachable from this device (use your PC's IP or Cloudflare)
					</Text>
				</View>

				<View style={[styles.card, isDarkMode && styles.cardDark]}>
					<Text style={[styles.label, textStyle]}>Device Info</Text>

					<Text style={[styles.subLabel, textStyle]}>Device ID:</Text>
					<Text style={[styles.value, textStyle]} selectable>
						{deviceId}
					</Text>

					<Text style={[styles.subLabel, textStyle, styles.marginTop10]}>
						FCM Token:
					</Text>

					<TouchableOpacity
						style={[styles.tokenBox, inputStyle]}
						onPress={handleCopyToken}
					>
						<Text
							style={[styles.tokenText, textStyle]}
							numberOfLines={2}
							ellipsizeMode="middle"
						>
							{fcmToken || "Waiting for token..."}
						</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.actionContainer}>
					<TouchableOpacity
						style={[styles.button, styles.secondaryButton]}
						onPress={handleGenerateConfig}
					>
						<Text style={styles.secondaryButtonText}>Generate Config MD</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={[styles.button, styles.primaryButton]}
						onPress={handleRegister}
						disabled={isRegistering}
					>
						{isRegistering ? (
							<ActivityIndicator color="#FFFFFF" />
						) : (
							<Text style={styles.primaryButtonText}>Register Device</Text>
						)}
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	scrollContent: {
		padding: 20,
	},
	header: {
		marginBottom: 24,
		alignItems: "center",
	},
	title: {
		fontSize: 28,
		fontWeight: "800",
		marginBottom: 8,
		letterSpacing: -0.5,
	},
	statusBadge: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 20,
		backgroundColor: "rgba(0,0,0,0.05)",
	},
	statusDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		marginRight: 8,
	},
	statusText: {
		fontSize: 14,
		fontWeight: "500",
	},
	card: {
		backgroundColor: "#FFFFFF",
		borderRadius: 16,
		padding: 20,
		marginBottom: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
	},
	cardDark: {
		backgroundColor: "#1F2937",
	},
	label: {
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 12,
	},
	subLabel: {
		fontSize: 12,
		fontWeight: "600",
		opacity: 0.7,
		marginBottom: 4,
	},
	value: {
		fontSize: 14,
		fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
		marginBottom: 4,
	},
	input: {
		height: 48,
		borderWidth: 1,
		borderRadius: 12,
		paddingHorizontal: 16,
		fontSize: 16,
	},
	hint: {
		fontSize: 12,
		color: "#6B7280",
		marginTop: 8,
	},
	tokenBox: {
		padding: 12,
		borderWidth: 1,
		borderRadius: 8,
		borderStyle: "dashed",
	},
	tokenText: {
		fontSize: 12,
		fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
	},
	actionContainer: {
		gap: 12,
		marginTop: 8,
	},
	button: {
		height: 52,
		borderRadius: 14,
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 12,
		elevation: 4,
	},
	primaryButton: {
		backgroundColor: "#2563EB",
	},
	primaryButtonText: {
		color: "#FFFFFF",
		fontSize: 16,
		fontWeight: "600",
	},
	secondaryButton: {
		backgroundColor: "#FFFFFF",
		borderWidth: 1,
		borderColor: "#E5E7EB",
	},
	secondaryButtonText: {
		color: "#374151",
		fontSize: 16,
		fontWeight: "600",
	},
	statusDotConnected: {
		backgroundColor: "#10B981",
	},
	statusDotDisconnected: {
		backgroundColor: "#EF4444",
	},
	marginTop10: {
		marginTop: 10,
	},
});

export default App;
