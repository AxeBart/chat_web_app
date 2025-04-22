import { io } from "socket.io-client";
import { useEffect, useState, useRef } from "react";
import { Send } from "lucide-react";

const url = "http://step-amplifier.gl.at.ply.gg:9010";
// const url = "http://localhost:3000"; // Remplacez par l'URL de votre serveur Socket.IO

function connectSocket() {
    try {
        const socket = io(url, {
            transports: ["websocket"],
            autoConnect: false,
        });

        socket.connect();

        socket.on("connect", () => {
            console.log("Connected to server");
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from server");
        });

        socket.on("connect_error", (error) => {
            console.error("Connection error:", error);
        });

        return socket;
    } catch (error) {
        console.error("Failed to initialize socket:", error);
        return null;
    }
}

const socket = connectSocket();
export default function Chat() {
    const [message, setMessage] = useState("");
    const [dbMessages, setDbMessage] = useState([]);
    const messagesEndRef = useRef(null); // Référence pour le scroll automatique

    const sendMessage = () => {
        if (socket && message.trim()) {
            socket.emit("message", { text: message, pseudo: sessionStorage.getItem('pseudo') }); // Envoie le message au serveur
            console.log("Message sent:", message);
            setMessage(""); // Réinitialise le champ de saisie
        } else {
            console.error("Socket not connected or message is empty");
        }
    };

    useEffect(() => {
        socket.on("message", (data) => {
            console.log("Received message:", data);
            setDbMessage((prevMessages) => [...prevMessages, data]); // Ajoute le message à la liste des messages
        });

        socket.on("load_messages", (messages) => {
            console.log("Loaded messages:", messages);
            setDbMessage(messages); // Met à jour la liste des messages avec ceux chargés depuis la base de données
        });

        return () => {
            socket.off("message");
            socket.off("load_messages");
        };
    }, []); // Exécute une fois au montage du composant

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" }); // Scroll automatique
        }
    }, [dbMessages]); // Déclenche le scroll à chaque mise à jour des messages

    return (
        <div className="h-svh">
            <RegisterPseudo />
            <div className="h-[100svh] bg-cover" style={{ backgroundImage: "url('/wallpaper02.jpg')" }}>
                <div className="h-[90svh] overflow-y-scroll">
                    {dbMessages.map((message, index) => {
                        if (message.pseudo === sessionStorage.getItem('pseudo')) {
                            return (
                                <div key={index} className="flex justify-end p-2">
                                    <div className="backdrop-blur-sm text-white rounded-t-3xl rounded-bl-3xl p-3 max-w-[80%]">{message.text}</div>
                                </div>
                            );
                        }
                        return (
                            <div key={index} className="flex justify-start p-2">
                                <div className="backdrop-blur-sm text-white rounded-t-3xl rounded-br-3xl p-3 max-w-[80%]">
                                    <span className="text-sm italic"> ~ {message.pseudo}</span> <br />
                                    {message.text}
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef}></div> {/* Référence pour le scroll automatique */}
                </div>
            </div>
            <div className="absolute bottom-0 w-full flex gap-2 justify-between items-center px-4 h-[10svh] mb-2 ">
                <div className="flex gap-2 px-2 py-2 items-center w-full bg-gray-800 rounded-4xl">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Message..."
                        className="border w-full outline-none placeholder:text-gray-500 text-white border-none px-2"
                    />
                    <button
                        onClick={sendMessage}
                        className="text-white rounded-full bg-gray-950 p-2"
                    >
                        <Send />
                    </button>
                </div>
                <div id="input"></div>
            </div>
        </div>
    );
}




function RegisterPseudo() {
    const [pseudo, setPseudo] = useState("");
    const [error, setError] = useState("");
    const [hideForm, setHideForm] = useState(false); // État pour gérer l'affichage du formulaire

    useEffect(() => {
        socket.on("register_error", (errorMessage) => {
            console.error("Register error:", errorMessage);
            setError(errorMessage); // Affiche l'erreur dans l'interface utilisateur
        })

        socket.on("register_success", (successMessage) => {
            sessionStorage.setItem("pseudo", successMessage); // Enregistre le pseudo dans le sessionStorage
            console.log("Register success:", successMessage);
            setHideForm(true); // Cache le formulaire après la connexion réussie
            setError(""); // Réinitialise l'erreur
        })

        socket.on("connect_pseudo_error", (errorMessage) => {
            console.error("Connect error:", errorMessage);
            setError(errorMessage); // Affiche l'erreur dans l'interface utilisateur
        })

        socket.on("connect_pseudo_success", (successMessage) => {
            sessionStorage.setItem("pseudo", successMessage); // Enregistre le pseudo dans le sessionStorage
            console.log("Connect success:", successMessage);
            setError(""); // Réinitialise l'erreur
            setHideForm(true); // Cache le formulaire après la connexion réussie
        })
    }, []); // Exécute une fois au montage du composant


    const validatePseudo = () => {
        const regex = /^[a-zA-Z0-9_]{3,16}$/; // Alphanumeric and underscores, 3-16 characters
        if (!regex.test(pseudo)) {
            setError("Pseudo must be 3-16 characters and can only contain letters, numbers, and underscores.");
            return false; // Pseudo is invalid
        } else {
            setError("");
            console.log("Pseudo is valid:", pseudo);
            return true; // Pseudo is valid
            // Add logic to handle valid pseudo (e.g., save or connect)
        }
    };

    const save = () => {
        if (pseudo) {
            console.log("Pseudo saved:", pseudo);
            if (validatePseudo()) {
                socket.emit("register_pseudo", pseudo); // Envoie le pseudo au serveur
            }
        } else {
            setError("Please enter a pseudo.");
        }
    }

    const confirm = () => {
        if (pseudo) {
            console.log("Pseudo confirmed:", pseudo);
            if (validatePseudo()) {
                socket.emit("connect_pseudo", pseudo); // Envoie le pseudo au serveur
            }
            // Add logic to handle confirmed pseudo (e.g., connect to chat)
        } else {
            setError("Please enter a pseudo.");
        }
    }

    return (
        <div className="" hidden={hideForm}>
            <div className="absolute backdrop-blur-2xl text-white h-svh w-svw top-0 left-0 z-30 p-5 flex items-center flex-col justify-center">
                <div className="rounded-3xl p-4 w-4/5" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                    <input
                        type="text"
                        value={pseudo}
                        onChange={(e) => { setPseudo(e.target.value) }}
                        className="text-gray-400 p-2 mb-4 text-center w-full outline-gray-600 outline-1 rounded-4xl"
                        placeholder="Pseudo"
                    />

                    <div className="flex gap-2">
                        <button
                            onClick={confirm}
                            className="w-full bg-gray-800 p-2 rounded-4xl text-white"
                        >
                            Connect
                        </button>
                        <button
                            onClick={save}
                            className="w-full bg-gray-800 p-2 rounded-4xl text-white"
                        >
                            Save
                        </button>
                    </div>
                </div>
                {error && <div className="text-red-500 text-sm p-4 my-2  w-4/5 bg-red-950/25 outline-1 outline-red-600 rounded-3xl">{error}</div>}
            </div>
        </div>
    );
}