// "use client";
// import { useEffect, useRef, useState } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { useCallSocket } from "../hooks/useCallSocket";
// import { Mic, MicOff, Video, VideoOff, Phone, PhoneOff } from "lucide-react";

// export const CallPopup = () => {
//     const {
//         incomingCall,
//         outgoingCall, // ADD THIS
//         callAccepted,
//         answerCall,
//         hangUp,
//         localStream,
//         remoteStream,
//     } = useCallSocket();

//     const [micOn, setMicOn] = useState(true);
//     const [cameraOn, setCameraOn] = useState(true);

//     const localVideoRef = useRef<HTMLVideoElement>(null);
//     const remoteVideoRef = useRef<HTMLVideoElement>(null);

//     // Update video elements when streams change
//     useEffect(() => {
//         if (localVideoRef.current && localStream?.current) {
//             localVideoRef.current.srcObject = localStream.current;
//         }

//         if (remoteVideoRef.current && remoteStream?.current) {
//             remoteVideoRef.current.srcObject = remoteStream.current.srcObject;
//         }
//     }, [localStream, remoteStream]);

//     const toggleMic = () => {
//         if (localStream?.current) {
//             const audioTracks = localStream.current.getAudioTracks();
//             if (audioTracks.length > 0) {
//                 audioTracks[0].enabled = !micOn;
//                 setMicOn(!micOn);
//             }
//         }
//     };

//     const toggleCamera = () => {
//         if (localStream?.current) {
//             const videoTracks = localStream.current.getVideoTracks();
//             if (videoTracks.length > 0) {
//                 videoTracks[0].enabled = !cameraOn;
//                 setCameraOn(!cameraOn);
//             }
//         }
//     };

//     const handleAnswerCall = () => {
//         answerCall();
//         setMicOn(true);
//         setCameraOn(true);
//     };

//     const handleHangUp = () => {
//         hangUp();
//         setMicOn(true);
//         setCameraOn(true);
//     };

//     const isIncomingCall = !!incomingCall && !callAccepted;
//     const isOutgoingCall = !!outgoingCall && !callAccepted; // ADD THIS
//     const isActiveCall = callAccepted;
//     const isVideoCall = incomingCall?.type === "video" || outgoingCall?.type === "video"; // UPDATE THIS

//     if (!isIncomingCall && !isOutgoingCall && !isActiveCall) return null; // UPDATE THIS

//     return (
//         <Dialog open={true}>
//             <DialogContent className="sm:max-w-md w-full p-4 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
//                 <DialogHeader>
//                     <DialogTitle className="text-center">
//                         {isIncomingCall
//                             ? `Incoming ${incomingCall.type} Call`
//                             : isOutgoingCall
//                             ? `Calling... (${outgoingCall.type})` // ADD THIS
//                             : "Ongoing Call"}
//                     </DialogTitle>
//                 </DialogHeader>

//                 <div className="flex flex-col gap-4 items-center justify-center mt-4">
//                     {/* Remote video/audio display */}
//                     <div className="relative w-full h-48 rounded-lg bg-gray-900 overflow-hidden">
//                         {isVideoCall ? (
//                             <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
//                         ) : (
//                             <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
//                                 <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center">
//                                     <Phone size={32} className="text-white" />
//                                 </div>
//                                 {(isOutgoingCall || isActiveCall) && ( // ADD THIS
//                                     <p className="absolute bottom-2 text-white text-sm">{isOutgoingCall ? "Calling..." : "Connected"}</p>
//                                 )}
//                             </div>
//                         )}

//                         {/* Local video preview */}
//                         {isVideoCall && (
//                             <div className="absolute bottom-2 right-2 w-20 h-20 rounded-lg overflow-hidden border-2 border-white bg-black">
//                                 <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
//                             </div>
//                         )}
//                     </div>

//                     {/* Call controls */}
//                     <div className="flex gap-3 w-full justify-center">
//                         {isIncomingCall ? (
//                             <>
//                                 <Button variant="destructive" onClick={handleHangUp} className="rounded-full h-12 w-12">
//                                     <PhoneOff size={20} />
//                                 </Button>
//                                 <Button variant="default" onClick={handleAnswerCall} className="rounded-full h-12 w-12 bg-green-600 hover:bg-green-700">
//                                     <Phone size={20} />
//                                 </Button>
//                             </>
//                         ) : isOutgoingCall ? ( // ADD THIS
//                             <Button variant="destructive" onClick={handleHangUp} className="rounded-full h-12 w-12">
//                                 <PhoneOff size={20} />
//                             </Button>
//                         ) : (
//                             <>
//                                 <Button variant={micOn ? "outline" : "secondary"} onClick={toggleMic} className="rounded-full h-12 w-12">
//                                     {micOn ? <Mic size={20} /> : <MicOff size={20} />}
//                                 </Button>

//                                 {isVideoCall && (
//                                     <Button variant={cameraOn ? "outline" : "secondary"} onClick={toggleCamera} className="rounded-full h-12 w-12">
//                                         {cameraOn ? <Video size={20} /> : <VideoOff size={20} />}
//                                     </Button>
//                                 )}

//                                 <Button variant="destructive" onClick={handleHangUp} className="rounded-full h-12 w-12">
//                                     <PhoneOff size={20} />
//                                 </Button>
//                             </>
//                         )}
//                     </div>
//                 </div>
//             </DialogContent>
//         </Dialog>
//     );
// };

// components/CallPopup.tsx
// components/CallPopup.tsx
// components/CallPopup.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCallSocket } from "../hooks/useCallSocket";
import { Mic, MicOff, Video, VideoOff, Phone, PhoneOff, User } from "lucide-react";

export const CallPopup = () => {
    const {
        incomingCall,
        outgoingCall, // ADD THIS
        callAccepted,
        answerCall,
        hangUp,
        localStream,
        remoteStream,
    } = useCallSocket();

    const [micOn, setMicOn] = useState(true);
    const [cameraOn, setCameraOn] = useState(true);

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    // Update video elements when streams change
    useEffect(() => {
        if (localVideoRef.current && localStream?.current) {
            localVideoRef.current.srcObject = localStream.current;
        }

        if (remoteVideoRef.current && remoteStream?.current) {
            remoteVideoRef.current.srcObject = remoteStream.current.srcObject;
        }
    }, [localStream, remoteStream]);

    const toggleMic = () => {
        if (localStream?.current) {
            const audioTracks = localStream.current.getAudioTracks();
            if (audioTracks.length > 0) {
                audioTracks[0].enabled = !micOn;
                setMicOn(!micOn);
            }
        }
    };

    const toggleCamera = () => {
        if (localStream?.current) {
            const videoTracks = localStream.current.getVideoTracks();
            if (videoTracks.length > 0) {
                videoTracks[0].enabled = !cameraOn;
                setCameraOn(!cameraOn);
            }
        }
    };

    const handleAnswerCall = () => {
        answerCall();
        setMicOn(true);
        setCameraOn(true);
    };

    const handleHangUp = () => {
        hangUp();
        setMicOn(true);
        setCameraOn(true);
    };

    const isIncomingCall = !!incomingCall && !callAccepted;
    const isOutgoingCall = !!outgoingCall; // ADD THIS
    const isActiveCall = callAccepted;
    const isVideoCall = incomingCall?.type === "video" || outgoingCall?.type === "video"; // UPDATE THIS

    // Don't render if no active call
    if (!isIncomingCall && !isOutgoingCall && !isActiveCall) return null; // UPDATE THIS

    return (
        <Dialog open={true}>
            <DialogContent className="sm:max-w-md w-full p-4 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <DialogHeader>
                    <DialogTitle className="text-center">
                        {isIncomingCall
                            ? `Incoming ${incomingCall.type} Call`
                            : isOutgoingCall // ADD THIS CONDITION
                            ? `${outgoingCall.status === "calling" ? "Starting" : outgoingCall.status === "ringing" ? "Ringing" : "Connected"} ${outgoingCall.type} Call`
                            : "Ongoing Call"}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4 items-center justify-center mt-4">
                    {/* Remote video/audio display */}
                    <div className="relative w-full h-48 rounded-lg bg-gray-900 overflow-hidden">
                        {isVideoCall ? (
                            <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
                                <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center">
                                    <User size={32} className="text-white" />
                                </div>
                                {(isOutgoingCall || isActiveCall) && ( // UPDATE THIS
                                    <p className="absolute bottom-2 text-white text-sm">{isOutgoingCall ? (outgoingCall.status === "calling" ? "Starting call..." : outgoingCall.status === "ringing" ? "Ringing..." : "Connected") : "Connected"}</p>
                                )}
                            </div>
                        )}

                        {/* Local video preview */}
                        {isVideoCall && localStream?.current && (
                            <div className="absolute bottom-2 right-2 w-20 h-20 rounded-lg overflow-hidden border-2 border-white bg-black">
                                <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>

                    {/* Call controls */}
                    <div className="flex gap-3 w-full justify-center">
                        {isIncomingCall ? (
                            <>
                                <Button variant="destructive" onClick={handleHangUp} className="rounded-full h-12 w-12">
                                    <PhoneOff size={20} />
                                </Button>
                                <Button variant="default" onClick={handleAnswerCall} className="rounded-full h-12 w-12 bg-green-600 hover:bg-green-700">
                                    <Phone size={20} />
                                </Button>
                            </>
                        ) : isOutgoingCall ? ( // ADD THIS
                            <Button variant="destructive" onClick={handleHangUp} className="rounded-full h-12 w-12">
                                <PhoneOff size={20} />
                            </Button>
                        ) : (
                            <>
                                <Button variant={micOn ? "outline" : "secondary"} onClick={toggleMic} className="rounded-full h-12 w-12">
                                    {micOn ? <Mic size={20} /> : <MicOff size={20} />}
                                </Button>

                                {isVideoCall && (
                                    <Button variant={cameraOn ? "outline" : "secondary"} onClick={toggleCamera} className="rounded-full h-12 w-12">
                                        {cameraOn ? <Video size={20} /> : <VideoOff size={20} />}
                                    </Button>
                                )}

                                <Button variant="destructive" onClick={handleHangUp} className="rounded-full h-12 w-12">
                                    <PhoneOff size={20} />
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
