"use client";

import { format } from "date-fns";

import { useChatQuery } from "@/hooks/use-chat-query";
import ChatWelcome from "./chat-welcome";
import { Loader2, ServerCrash } from "lucide-react";
import { Fragment, useRef } from "react";
import { ChatItem } from "./chat-item";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scroll";

const DATE_FORMAT = "d MMM yyyy,HH:mm";

const ChatMessage = ({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
}) => {
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;
  const queryKey = `chat:${chatId}`;

  const chatRef = useRef(null);
  const bottomRef = useRef(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({ queryKey, apiUrl, paramKey, paramValue });
  useChatSocket({ queryKey, addKey, updateKey });
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && hasNextPage,
    count: data?.pages[0].items.length ?? 0,
  });
  if (status === "loading") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-7 w-7 text-zinc-500my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong
        </p>
      </div>
    );
  }
  return (
    <div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
      {!hasNextPage && <div className="flex-1"></div>}
      {!hasNextPage && <ChatWelcome type={type} name={name} />}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs-my-4 dark:hover:text-zinc-300 transition"
            >
              Load previous message
            </button>
          )}
        </div>
      )}
      <div className="flex flex-col-reverse mt-auto ">
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group.items.map((message) => (
              <ChatItem
                key={message.id}
                currentMember={member}
                member={message.member}
                id={message.id}
                content={message.content}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                isUpdated={message.updateAt !== message.createdAt}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef}></div>
    </div>
  );
};

export default ChatMessage;
