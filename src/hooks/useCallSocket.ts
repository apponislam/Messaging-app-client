// import { useEffect, useRef, useState } from "react";
// import { useSelector } from "react-redux";
// import { io, Socket } from "socket.io-client";
// import Peer from "simple-peer";
// import { RootState } from "../redux/store";

// export interface CallSignalData {
//     callId: string;
//     from: string;
//     signal: Peer.SignalData;
//     type?: "audio" | "video";
// }

// export const useCallSocket = () => {
//     const token = useSelector((state: RootState) => state.auth.token);

//     const [callSocket, setCallSocket] = useState<Socket | null>(null);
//     const [incomingCall, setIncomingCall] = useState<CallSignalData | null>(null);
//     const [callAccepted, setCallAccepted] = useState(false);

//     const localStream = useRef<MediaStream | null>(null);
//     const remoteStream = useRef<HTMLVideoElement | null>(null);
//     const peerRef = useRef<Peer.Instance | null>(null);

//     // Initialize socket connection
//     useEffect(() => {
//         if (!token) return;

//         const s = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000", {
//             auth: { token },
//             transports: ["websocket", "polling"],
//         });

//         setCallSocket(s);

//         s.on("connect", () => {
//             console.log("Socket connected!", s.id);
//         });

//         s.on("call:incoming", (data: CallSignalData) => {
//             setIncomingCall(data);
//         });

//         s.on("call:signal", (data: CallSignalData) => {
//             if (peerRef.current && data.signal) {
//                 peerRef.current.signal(data.signal);
//             }
//         });

//         return () => {
//             s.disconnect();
//         };
//     }, [token]);

//     // Start a new call
//     const startCall = async (recipientId: string, type: "audio" | "video") => {
//         if (!callSocket) return;

//         const stream = await navigator.mediaDevices.getUserMedia({
//             video: type === "video",
//             audio: true,
//         });
//         localStream.current = stream;

//         const callId = `${callSocket.id}_${recipientId}_${Date.now()}`;
//         const p = new Peer({ initiator: true, trickle: false, stream });
//         peerRef.current = p;

//         p.on("signal", (signalData) => {
//             callSocket.emit("call:signal", { callId, targetUserId: recipientId, signal: signalData });
//         });

//         p.on("stream", (remote) => {
//             if (remoteStream.current) remoteStream.current.srcObject = remote;
//         });

//         callSocket.emit("call:start", { recipientId, type });
//     };

//     // Answer an incoming call
//     const answerCall = async () => {
//         if (!incomingCall || !callSocket) return;

//         const stream = await navigator.mediaDevices.getUserMedia({
//             video: incomingCall.type === "video",
//             audio: true,
//         });
//         localStream.current = stream;

//         const p = new Peer({ initiator: false, trickle: false, stream });
//         peerRef.current = p;

//         p.on("signal", (signalData) => {
//             callSocket.emit("call:signal", {
//                 callId: incomingCall.callId,
//                 targetUserId: incomingCall.from,
//                 signal: signalData,
//             });
//         });

//         p.on("stream", (remote) => {
//             if (remoteStream.current) remoteStream.current.srcObject = remote;
//         });

//         if (incomingCall.signal) {
//             p.signal(incomingCall.signal);
//         }

//         setCallAccepted(true);
//         setIncomingCall(null);
//     };

//     // Hang up the current call
//     const hangUp = () => {
//         peerRef.current?.destroy();
//         peerRef.current = null;

//         if (callSocket && incomingCall) {
//             callSocket.emit("call:hangup", {
//                 callId: incomingCall.callId,
//                 targetUserId: incomingCall.from,
//             });
//         }

//         setCallAccepted(false);
//         setIncomingCall(null);

//         if (localStream.current) {
//             localStream.current.getTracks().forEach((track) => track.stop());
//             localStream.current = null;
//         }
//     };

//     return {
//         callSocket,
//         incomingCall,
//         callAccepted,
//         localStream,
//         remoteStream,
//         startCall,
//         answerCall,
//         hangUp,
//     };
// };
// hooks/useCallSocket.ts

// 2

// import { useEffect, useRef, useState, useCallback } from "react";
// import { useSelector } from "react-redux";
// import { io, Socket } from "socket.io-client";
// import Peer from "simple-peer";
// import { RootState } from "../redux/store";

// export interface CallSignalData {
//     callId: string;
//     from: string;
//     signal: Peer.SignalData;
//     type?: "audio" | "video";
// }

// export const useCallSocket = () => {
//     const token = useSelector((state: RootState) => state.auth.token);

//     const [callSocket, setCallSocket] = useState<Socket | null>(null);
//     const [incomingCall, setIncomingCall] = useState<CallSignalData | null>(null);
//     const [callAccepted, setCallAccepted] = useState(false);
//     const [outgoingCall, setOutgoingCall] = useState<{ recipientId: string; type: "audio" | "video" } | null>(null);

//     const localStream = useRef<MediaStream | null>(null);
//     const remoteStream = useRef<HTMLVideoElement | null>(null);
//     const peerRef = useRef<Peer.Instance | null>(null);

//     // Create a stable reference to hangUp that doesn't change
//     const hangUpRef = useRef(() => {
//         if (peerRef.current) {
//             peerRef.current.destroy();
//             peerRef.current = null;
//         }

//         if (callSocket && incomingCall) {
//             callSocket.emit("call:hangup", {
//                 callId: incomingCall.callId,
//                 targetUserId: incomingCall.from,
//             });
//         }

//         if (callSocket && outgoingCall) {
//             callSocket.emit("call:hangup", {
//                 callId: `${callSocket.id}_${outgoingCall.recipientId}_${Date.now()}`,
//                 targetUserId: outgoingCall.recipientId,
//             });
//         }

//         setCallAccepted(false);
//         setIncomingCall(null);
//         setOutgoingCall(null);

//         if (localStream.current) {
//             localStream.current.getTracks().forEach((track) => track.stop());
//             localStream.current = null;
//         }
//     });

//     // Update the hangUpRef when dependencies change
//     useEffect(() => {
//         hangUpRef.current = () => {
//             if (peerRef.current) {
//                 peerRef.current.destroy();
//                 peerRef.current = null;
//             }

//             if (callSocket && incomingCall) {
//                 callSocket.emit("call:hangup", {
//                     callId: incomingCall.callId,
//                     targetUserId: incomingCall.from,
//                 });
//             }

//             if (callSocket && outgoingCall) {
//                 callSocket.emit("call:hangup", {
//                     callId: `${callSocket.id}_${outgoingCall.recipientId}_${Date.now()}`,
//                     targetUserId: outgoingCall.recipientId,
//                 });
//             }

//             setCallAccepted(false);
//             setIncomingCall(null);
//             setOutgoingCall(null);

//             if (localStream.current) {
//                 localStream.current.getTracks().forEach((track) => track.stop());
//                 localStream.current = null;
//             }
//         };
//     }, [callSocket, incomingCall, outgoingCall]);

//     // Initialize socket connection
//     useEffect(() => {
//         if (!token) return;

//         const s = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000", {
//             auth: { token },
//             transports: ["websocket", "polling"],
//         });

//         setCallSocket(s);

//         s.on("connect", () => {
//             console.log("Socket connected!", s.id);
//         });

//         s.on("call:incoming", (data: CallSignalData) => {
//             setIncomingCall(data);
//         });

//         s.on("call:accepted", (data: { callId: string }) => {
//             console.log(data);
//             setCallAccepted(true);
//         });

//         s.on("call:rejected", (data: { callId: string }) => {
//             console.log(data);
//             setOutgoingCall(null);
//             hangUpRef.current(); // Use the ref version
//         });

//         s.on("call:signal", (data: CallSignalData) => {
//             if (peerRef.current && data.signal) {
//                 peerRef.current.signal(data.signal);
//             }
//         });

//         return () => {
//             s.disconnect();
//         };
//     }, [token]); // Remove hangUp from dependencies

//     // Start a new call
//     const startCall = useCallback(
//         async (recipientId: string, type: "audio" | "video") => {
//             if (!callSocket) return;

//             setOutgoingCall({ recipientId, type });

//             try {
//                 const stream = await navigator.mediaDevices.getUserMedia({
//                     video: type === "video",
//                     audio: true,
//                 });
//                 localStream.current = stream;

//                 const callId = `${callSocket.id}_${recipientId}_${Date.now()}`;
//                 const p = new Peer({ initiator: true, trickle: false, stream });
//                 peerRef.current = p;

//                 p.on("signal", (signalData) => {
//                     callSocket.emit("call:signal", { callId, targetUserId: recipientId, signal: signalData });
//                 });

//                 p.on("stream", (remote) => {
//                     if (remoteStream.current) remoteStream.current.srcObject = remote;
//                 });

//                 p.on("close", () => {
//                     hangUpRef.current();
//                 });

//                 callSocket.emit("call:start", { recipientId, type, callId });
//             } catch (error) {
//                 console.error("Error starting call:", error);
//                 setOutgoingCall(null);
//                 hangUpRef.current();
//             }
//         },
//         [callSocket]
//     );

//     // Answer an incoming call
//     const answerCall = useCallback(async () => {
//         if (!incomingCall || !callSocket) return;

//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({
//                 video: incomingCall.type === "video",
//                 audio: true,
//             });
//             localStream.current = stream;

//             const p = new Peer({ initiator: false, trickle: false, stream });
//             peerRef.current = p;

//             p.on("signal", (signalData) => {
//                 callSocket.emit("call:signal", {
//                     callId: incomingCall.callId,
//                     targetUserId: incomingCall.from,
//                     signal: signalData,
//                 });
//             });

//             p.on("stream", (remote) => {
//                 if (remoteStream.current) remoteStream.current.srcObject = remote;
//             });

//             p.on("close", () => {
//                 hangUpRef.current();
//             });

//             if (incomingCall.signal) {
//                 p.signal(incomingCall.signal);
//             }

//             setCallAccepted(true);
//             setIncomingCall(null);
//             callSocket.emit("call:accept", { callId: incomingCall.callId });
//         } catch (error) {
//             console.error("Error answering call:", error);
//             hangUpRef.current();
//         }
//     }, [incomingCall, callSocket]);

//     // Export hangUp function
//     const hangUp = useCallback(() => {
//         hangUpRef.current();
//     }, []);

//     return {
//         callSocket,
//         incomingCall,
//         outgoingCall,
//         callAccepted,
//         localStream,
//         remoteStream,
//         startCall,
//         answerCall,
//         hangUp,
//     };
// };

// hooks/useCallSocket.ts
// hooks/useCallSocket.ts
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import Peer from "simple-peer";
import { RootState } from "../redux/store";

export interface CallSignalData {
    callId: string;
    from: string;
    signal: Peer.SignalData;
    type?: "audio" | "video";
}

export const useCallSocket = () => {
    const token = useSelector((state: RootState) => state.auth.token);

    const [callSocket, setCallSocket] = useState<Socket | null>(null);
    const [incomingCall, setIncomingCall] = useState<CallSignalData | null>(null);
    const [callAccepted, setCallAccepted] = useState(false);
    const [outgoingCall, setOutgoingCall] = useState<{
        recipientId: string;
        type: "audio" | "video";
        status: "calling" | "ringing" | "connected";
    } | null>(null); // ADD THIS LINE

    const localStream = useRef<MediaStream | null>(null);
    const remoteStream = useRef<HTMLVideoElement | null>(null);
    const peerRef = useRef<Peer.Instance | null>(null);

    // Initialize socket connection
    useEffect(() => {
        if (!token) return;

        const s = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000", {
            auth: { token },
            transports: ["websocket", "polling"],
        });

        setCallSocket(s);

        s.on("connect", () => {
            console.log("Socket connected!", s.id);
        });

        s.on("call:incoming", (data: CallSignalData) => {
            setIncomingCall(data);
        });

        s.on("call:accepted", (data: { callId: string }) => {
            console.log("Call accepted:", data);
            setCallAccepted(true);
            setOutgoingCall((prev) => (prev ? { ...prev, status: "connected" } : null));
        });

        s.on("call:rejected", (data: { callId: string }) => {
            console.log("Call rejected:", data);
            setOutgoingCall(null);
            // Clean up resources
            if (localStream.current) {
                localStream.current.getTracks().forEach((track) => track.stop());
                localStream.current = null;
            }
        });

        s.on("call:signal", (data: CallSignalData) => {
            if (peerRef.current && data.signal) {
                peerRef.current.signal(data.signal);
            }
        });

        return () => {
            s.disconnect();
        };
    }, [token]);

    // Hang up function
    const hangUp = () => {
        if (peerRef.current) {
            peerRef.current.destroy();
            peerRef.current = null;
        }

        if (callSocket) {
            if (incomingCall) {
                callSocket.emit("call:hangup", {
                    callId: incomingCall.callId,
                    targetUserId: incomingCall.from,
                });
            }

            if (outgoingCall) {
                callSocket.emit("call:hangup", {
                    callId: `${callSocket.id}_${outgoingCall.recipientId}_${Date.now()}`,
                    targetUserId: outgoingCall.recipientId,
                });
            }
        }

        setCallAccepted(false);
        setIncomingCall(null);
        setOutgoingCall(null);

        if (localStream.current) {
            localStream.current.getTracks().forEach((track) => track.stop());
            localStream.current = null;
        }
    };

    // Start a new call
    const startCall = async (recipientId: string, type: "audio" | "video") => {
        if (!callSocket) return;

        // Set outgoing call state first to show the UI immediately
        setOutgoingCall({ recipientId, type, status: "calling" });

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: type === "video",
                audio: true,
            });
            localStream.current = stream;

            const callId = `${callSocket.id}_${recipientId}_${Date.now()}`;
            const p = new Peer({ initiator: true, trickle: false, stream });
            peerRef.current = p;

            p.on("signal", (signalData) => {
                callSocket.emit("call:signal", { callId, targetUserId: recipientId, signal: signalData });
            });

            p.on("stream", (remote) => {
                if (remoteStream.current) remoteStream.current.srcObject = remote;
                setOutgoingCall((prev) => (prev ? { ...prev, status: "connected" } : null));
            });

            p.on("close", () => {
                hangUp();
            });

            p.on("error", (error) => {
                console.error("Peer error:", error);
                hangUp();
            });

            // Update status to ringing after media is acquired
            setOutgoingCall((prev) => (prev ? { ...prev, status: "ringing" } : null));

            callSocket.emit("call:start", { recipientId, type, callId });
        } catch (error) {
            console.error("Error starting call:", error);
            setOutgoingCall(null);
            if (localStream.current) {
                localStream.current.getTracks().forEach((track) => track.stop());
                localStream.current = null;
            }
        }
    };

    // Answer an incoming call
    const answerCall = async () => {
        if (!incomingCall || !callSocket) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: incomingCall.type === "video",
                audio: true,
            });
            localStream.current = stream;

            const p = new Peer({ initiator: false, trickle: false, stream });
            peerRef.current = p;

            p.on("signal", (signalData) => {
                callSocket.emit("call:signal", {
                    callId: incomingCall.callId,
                    targetUserId: incomingCall.from,
                    signal: signalData,
                });
            });

            p.on("stream", (remote) => {
                if (remoteStream.current) remoteStream.current.srcObject = remote;
            });

            p.on("close", () => {
                hangUp();
            });

            p.on("error", (error) => {
                console.error("Error answering call:", error);
                hangUp();
            });

            if (incomingCall.signal) {
                p.signal(incomingCall.signal);
            }

            setCallAccepted(true);
            setIncomingCall(null);
            callSocket.emit("call:accept", { callId: incomingCall.callId });
        } catch (error) {
            console.error("Error answering call:", error);
            hangUp();
        }
    };

    return {
        callSocket,
        incomingCall,
        outgoingCall, // MAKE SURE THIS IS RETURNED
        callAccepted,
        localStream,
        remoteStream,
        startCall,
        answerCall,
        hangUp,
    };
};
