"use client";

import GhostCEOChat from "@/components/GhostCEOChat";
import ChatVisualizer from "@/components/ChatVisualizer";

export default function ChatPage() {
    return (
        <div className="h-full flex flex-col">
            <div className="px-4 md:px-8 pt-4 md:pt-8">
                <ChatVisualizer />
            </div>
            <div className="flex-1 overflow-hidden px-4 md:px-8 pb-4 md:pb-8">
                <GhostCEOChat />
            </div>
        </div>
    )
}
