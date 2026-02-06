require("dotenv").config();
const express = require("express");
const WebSocket = require("ws");
const admin = require("firebase-admin");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Firebase Admin Initialization
const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");
if (fs.existsSync(serviceAccountPath)) {
	try {
		admin.initializeApp({
			credential: admin.credential.cert(require(serviceAccountPath)),
		});
		console.log("Firebase Admin initialized.");
	} catch (error) {
		console.error("Failed to initialize Firebase Admin:", error);
	}
} else {
	console.warn(
		"serviceAccountKey.json not found. FCM functionality will be mocked.",
	);
}

// In-memory device store
const devices = new Map();

app.get("/", (req, res) => {
	res.send("Claw Notify Server Running");
});

// Register device FCM token
app.post("/register", (req, res) => {
	const { token, deviceId } = req.body;
	if (!token || !deviceId) {
		return res.status(400).send("Missing token or deviceId");
	}
	devices.set(deviceId, token);
	console.log(`Device registered: ${deviceId}`);
	res.send({ status: "Registered", deviceId });
});

// Notify endpoint
app.post("/notify", async (req, res) => {
	const { text, deviceId = "android-main" } = req.body;
	const token = devices.get(deviceId);
	if (!token) return res.status(404).send("No device registered");

	const message = {
		token,
		data: {
			type: "notification",
			title: "OpenClaw",
			body: text || "Hello from OpenClaw",
			priority: "high",
		},
	};

	try {
		if (admin.apps.length > 0) {
			await admin.messaging().send(message);
			console.log("FCM Notification sent");
		} else {
			console.log("Mock FCM: Notification would be sent", message);
		}
		res.send("Sent");
	} catch (error) {
		console.error("Error sending FCM notification:", error);
		res.status(500).send("Failed to send notification");
	}
});

// Call endpoint
app.post("/call", async (req, res) => {
	const { deviceId = "android-main" } = req.body;
	const token = devices.get(deviceId);
	if (!token) return res.status(404).send("No device registered");

	const uuid = crypto.randomUUID();
	// PUBLIC_URL must be the Cloudflare Tunnel URL (wss://...)
	const serverUrl =
		process.env.PUBLIC_URL || "wss://your-tunnel-url.trycloudflare.com";

	const message = {
		token,
		data: {
			type: "call",
			uuid,
			callerName: "OpenClaw AI",
			priority: "high",
			// App connects here
			serverUrl,
		},
	};

	try {
		if (admin.apps.length > 0) {
			await admin.messaging().send(message);
			console.log("FCM Call trigger sent");
		} else {
			console.log("Mock FCM: Call trigger would be sent", message);
		}
		res.send({ status: "Calling", uuid });
	} catch (error) {
		console.error("Error sending FCM call trigger:", error);
		res.status(500).send("Failed to trigger call");
	}
});

const server = app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});

const GEMINI_URL =
	"wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent";

const wss = new WebSocket.Server({ server });

wss.on("connection", (appSocket) => {
	console.log("App connected for audio session");

	if (!process.env.GEMINI_API_KEY) {
		console.error("GEMINI_API_KEY is missing in .env");
		appSocket.send(
			JSON.stringify({
				type: "error",
				message: "Server configuration error: Missing API Key",
			}),
		);
		appSocket.close();
		return;
	}

	// 1. Connect to Gemini (with Auth Header)
	const geminiWs = new WebSocket(GEMINI_URL, {
		headers: { "x-goog-api-key": process.env.GEMINI_API_KEY },
	});

	geminiWs.on("open", () => {
		console.log("Connected to Gemini Multimodal Live API");
		// 2. Initial Setup (Model Config)
		const setupMsg = {
			setup: {
				model: "models/gemini-2.0-flash-exp",
				generationConfig: {
					responseModalities: ["AUDIO"],
					speechConfig: {
						voiceConfig: { prebuiltVoiceConfig: { voiceName: "Puck" } },
					},
				},
			},
		};
		geminiWs.send(JSON.stringify(setupMsg));
	});

	// 3. Relay: App Audio -> Gemini
	appSocket.on("message", (data) => {
		try {
			const message = JSON.parse(data);
			if (message.type === "audio" && geminiWs.readyState === WebSocket.OPEN) {
				// Gemini expects "realtimeInput" with "mediaChunks"
				geminiWs.send(
					JSON.stringify({
						realtimeInput: {
							mediaChunks: [{ mimeType: "audio/pcm", data: message.payload }],
						},
					}),
				);
			}
		} catch (error) {
			console.error("Error processing app audio message:", error);
		}
	});

	// 4. Relay: Gemini Audio -> App
	geminiWs.on("message", (msg) => {
		try {
			const response = JSON.parse(msg);

			// Handle setup completion
			if (response.setupComplete) {
				console.log("Gemini setup complete");
				return;
			}

			// Gemini 2.0 Flash Live API response structure
			const audioData =
				response.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
			if (audioData) {
				appSocket.send(JSON.stringify({ type: "audio", payload: audioData }));
			}
		} catch (error) {
			console.error("Error processing Gemini message:", error);
		}
	});

	geminiWs.on("error", (error) => {
		console.error("Gemini WebSocket error:", error);
		if (appSocket.readyState === WebSocket.OPEN) {
			appSocket.send(
				JSON.stringify({ type: "error", message: "Gemini connection error" }),
			);
		}
	});

	appSocket.on("error", (error) => {
		console.error("App WebSocket error:", error);
	});

	// Cleanup
	appSocket.on("close", () => {
		console.log("App socket closed");
		if (
			geminiWs.readyState === WebSocket.OPEN ||
			geminiWs.readyState === WebSocket.CONNECTING
		) {
			geminiWs.close();
		}
	});
	geminiWs.on("close", () => {
		console.log("Gemini socket closed");
		if (
			appSocket.readyState === WebSocket.OPEN ||
			appSocket.readyState === WebSocket.CONNECTING
		) {
			appSocket.close();
		}
	});
});
