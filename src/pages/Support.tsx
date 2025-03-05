"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface Ticket {
  id: number;
  title: string;
  description: string;
  status: "open" | "closed";
  messages: { sender: "user" | "support"; content: string }[];
}

const Support: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newTicket, setNewTicket] = useState({ title: "", description: "" });
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyMessage, setReplyMessage] = useState<string>("");

  // Neues Ticket erstellen
  const createTicket = () => {
    if (newTicket.title.trim() && newTicket.description.trim()) {
      const newEntry: Ticket = {
        id: tickets.length + 1,
        title: newTicket.title,
        description: newTicket.description,
        status: "open",
        messages: [{ sender: "user", content: newTicket.description }],
      };
      setTickets([...tickets, newEntry]);
      setIsModalOpen(false);
      setNewTicket({ title: "", description: "" });
    }
  };

  // Nachricht an ein Ticket senden
  const sendMessage = (ticketId: number) => {
    if (replyMessage.trim()) {
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.id === ticketId
            ? { ...ticket, messages: [...ticket.messages, { sender: "user", content: replyMessage }] }
            : ticket
        )
      );
      setReplyMessage("");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-6">
        <h1 className="text-3xl font-bold mb-4">Support-Tickets</h1>

        <button onClick={() => setIsModalOpen(true)} className="px-6 py-2 bg-blue-500 text-white rounded-lg">
          Neues Ticket erstellen
        </button>

        <div className="mt-6">
          {tickets.length > 0 ? (
            <ul className="space-y-4">
              {tickets.map((ticket) => (
                <li
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <p className="text-lg font-semibold">{ticket.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Status: {ticket.status === "open" ? "🟢 Offen" : "🔴 Geschlossen"}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 mt-4">Keine Tickets vorhanden.</p>
          )}
        </div>

        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          >
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-2xl font-bold mb-4">Neues Ticket erstellen</h2>
              <input
                type="text"
                placeholder="Titel"
                value={newTicket.title}
                onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                className="w-full p-2 mb-4 border rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <textarea
                placeholder="Beschreibung"
                value={newTicket.description}
                onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                className="w-full p-2 mb-4 border rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <div className="flex justify-end">
                <button onClick={() => setIsModalOpen(false)} className="mr-2 px-4 py-2 bg-gray-500 text-white rounded">
                  Abbrechen
                </button>
                <button onClick={createTicket} className="px-4 py-2 bg-blue-500 text-white rounded">
                  Erstellen
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {selectedTicket && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          >
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-2xl font-bold mb-4">{selectedTicket.title}</h2>
              <p className="mb-4 text-gray-600 dark:text-gray-400">{selectedTicket.description}</p>

              <div className="h-40 overflow-y-auto p-2 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4">
                {selectedTicket.messages.map((msg, index) => (
                  <p key={index} className={msg.sender === "user" ? "text-right text-blue-500" : "text-left text-green-500"}>
                    {msg.sender === "user" ? "Du: " : "Support: "}
                    {msg.content}
                  </p>
                ))}
              </div>

              <div className="flex">
                <input
                  type="text"
                  placeholder="Antwort eingeben..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="flex-1 p-2 border rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button onClick={() => sendMessage(selectedTicket.id)} className="px-4 bg-blue-500 text-white rounded ml-2">
                  Senden
                </button>
              </div>

              <div className="flex justify-end mt-4">
                <button onClick={() => setSelectedTicket(null)} className="px-4 py-2 bg-gray-500 text-white rounded">
                  Schließen
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Support;
