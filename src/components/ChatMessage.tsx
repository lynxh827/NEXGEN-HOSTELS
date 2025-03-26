
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  content: string;
  sender: string;
  timestamp: Date | string; // Allow both Date and string
  isAdmin: boolean;
  isCurrentUser: boolean;
}

const ChatMessage = ({
  content,
  sender,
  timestamp,
  isAdmin,
  isCurrentUser,
}: ChatMessageProps) => {
  // Convert timestamp to Date if it's a string
  const timestampDate = timestamp instanceof Date ? timestamp : new Date(timestamp);

  return (
    <div
      className={cn(
        "flex w-full mb-4",
        isCurrentUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex max-w-[80%]",
          isCurrentUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src="" />
          <AvatarFallback
            className={cn(
              isAdmin ? "bg-blue-600 text-white" : "bg-green-600 text-white"
            )}
          >
            {sender.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div
          className={cn(
            "flex flex-col",
            isCurrentUser ? "items-end mr-2" : "items-start ml-2"
          )}
        >
          <div
            className={cn(
              "px-4 py-2 rounded-lg",
              isCurrentUser
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            )}
          >
            <p className="text-sm">{content}</p>
          </div>
          <div className="flex items-center mt-1 space-x-2">
            <span className="text-xs text-gray-500">{sender}</span>
            <span className="text-xs text-gray-400">
              {timestampDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
