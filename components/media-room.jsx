"use client";

import { useEffect, useRef, useState } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import { Channel } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export const MediaRoom = ({ chatId, video, audio }) => {
  const { user } = useUser();
  console.log("user", user);
  const [token, setToken] = useState("");
  const resp = useRef();
  useEffect(() => {
    console.log("reasonfornousername");
    if (!user?.username && !user?.fullName) return;
    console.log("NOT-reasonfornousername");
    const name = `${user.username || user.fullName}`;
    (async () => {
      try {
        resp.current = await fetch(
          `/api/livekit?room=${chatId}&username=${name}`
        );
        const data = await resp.current.json();
        setToken(data.token);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [chatId, user, resp]);

  if (token === "") {
    console.log("NO TOKEN");
    return (
      <div className="flex flex-col justify-center items-center">
        <Loader2 className="w-7 h-7 text-indigo-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400"></p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      video={video}
      audio={audio}
    >
      <VideoConference />
    </LiveKitRoom>
  );
};
