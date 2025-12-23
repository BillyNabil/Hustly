"use client";

import VisionBoard from "@/components/VisionBoard";
import VisionVisualizer from "@/components/VisionVisualizer";

export default function VisionPage() {
    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto">
            <VisionVisualizer />
            <VisionBoard />
        </div>
    )
}
