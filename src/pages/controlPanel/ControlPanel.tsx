"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "https://your-api-url.com"; // Ersetze mit deiner API-URL

const ControlPanel: React.FC = () => {
    const [botStatus, setBotStatus] = useState<string>("Unknown");
    const [command, setCommand] = useState<string>("");
    const [response, setResponse] = useState<string>("");

    // Bot-Status abrufen
    const fetchBotStatus = async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/bot/status`);
            setBotStatus(data.status);
        } catch (error) {
            setBotStatus("Error");
        }
    };

    // Bot starten
    const startBot = async () => {
        try {
            await axios.post(`${API_BASE_URL}/bot/start`);
            setBotStatus("Running");
        } catch (error) {
            console.error("Fehler beim Starten des Bots", error);
        }
    };

    // Bot stoppen
    const stopBot = async () => {
        try {
            await axios.post(`${API_BASE_URL}/bot/stop`);
            setBotStatus("Stopped");
        } catch (error) {
            console.error("Fehler beim Stoppen des Bots", error);
        }
    };

    // Bot neustarten
    const restartBot = async () => {
        try {
            await axios.post(`${API_BASE_URL}/bot/restart`);
            setBotStatus("Restarting...");
            setTimeout(fetchBotStatus, 5000);
        } catch (error) {
            console.error("Fehler beim Neustarten des Bots", error);
        }
    };

    // Befehl an den Bot senden
    const sendCommand = async () => {
        if (!command) return;

        try {
            const { data } = await axios.post(`${API_BASE_URL}/bot/command`, { command });
            setResponse(data.response || "Keine Antwort erhalten.");
        } catch (error) {
            console.error("Fehler beim Senden des Befehls", error);
            setResponse("Fehler beim Ausführen des Befehls.");
        }
    };

    // Beim Laden der Seite den Bot-Status abrufen
    useEffect(() => {
        fetchBotStatus();
    }, []);

    return (
        <div className="max-w-2xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Discord Bot Control Panel</h2>
            <p className="mb-4">
                <strong>Status:</strong> {botStatus}
            </p>

            <div className="flex space-x-2 mb-4">
                <button onClick={startBot} className="px-4 py-2 bg-green-600 rounded hover:bg-green-700">
                    Start
                </button>
                <button onClick={stopBot} className="px-4 py-2 bg-red-600 rounded hover:bg-red-700">
                    Stop
                </button>
                <button onClick={restartBot} className="px-4 py-2 bg-yellow-500 rounded hover:bg-yellow-600">
                    Restart
                </button>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    placeholder="Befehl eingeben..."
                    className="w-full p-2 rounded bg-gray-700 text-white"
                />
                <button onClick={sendCommand} className="mt-2 px-4 py-2 bg-blue-500 rounded hover:bg-blue-600">
                    Senden
                </button>
            </div>

            {response && (
                <div className="mt-4 p-2 bg-gray-700 rounded">
                    <strong>Antwort:</strong>
                    <p>{response}</p>
                </div>
            )}
        </div>
    );
};

export default ControlPanel;