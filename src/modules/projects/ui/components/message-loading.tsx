import Image from "next/image";
import {useState, useEffect} from "react";

const ShimmerMessages = () => {
    const messages = [
        "Thinking...",
        "Loading...",
        "Analyzing your request...",
        "Building your website...",
        "Optimizing Layout...",
        "Finalizing details...",
        "Almost there...",
        "Adding final touches...",
        "Almost done...",
        "Just a moment...",
        "Preparing your content...",
        "Generating response...",
        "Analyzing data...",
        "Compiling information...",

    ]

    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
        }, 2000); // Change message every 3 seconds

        return () => clearInterval(interval);
    }, [messages.length]);

    return (
        <div className="flex items-center gap-2">
            <span className="text-base text-muted-foreground animated-pulse">
                {messages[currentMessageIndex]}
            </span>
        </div>
    );
};

export const MessageLoading = () => {
    return (
        <div className="flex flex-col group px-2 pb-4">
            <div className="flex items-center gap-2 mb-2">
                <Image
                src="/logo.svg"
                alt="Genie"
                width={18}
                height={18}
                className="shrink-0"
                />
                <span className="text-sm font-medium ">Genie</span>
            </div>
            <div className="pl-8.5 flex flex-col gap-y-4">
                <ShimmerMessages/>
            </div>
        </div>
    );
};