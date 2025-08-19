import { Button } from "@/components/ui/button";
import { useCallSocket } from "../hooks/useCallSocket";
import { Phone, Video } from "lucide-react";

interface CallButtonsProps {
    recipientId: string;
}

export const CallButtons: React.FC<CallButtonsProps> = ({ recipientId }) => {
    const { startCall } = useCallSocket();

    return (
        <div className="flex gap-2">
            <Button onClick={() => startCall(recipientId, "audio")} variant="ghost" size="icon">
                <Phone size={20} />
            </Button>

            <Button onClick={() => startCall(recipientId, "video")} variant="ghost" size="icon">
                <Video size={20} />
            </Button>
        </div>
    );
};
