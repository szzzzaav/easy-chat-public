"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export const DeleteServerModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { server } = data;
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const isModalOpen = isOpen && type === "deleteServer";

  const onClick = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/servers/${server?.id}`);
      onClose();
      router.refresh();
      router.push("/");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold text-indigo-900">
            删除服务器
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            你确定要删除{" "}
            <span className="font-semibold text-indigo-500">
              {server?.name}
            </span>
            ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
              取消
            </Button>
            <Button disabled={isLoading} onClick={onClick} variant="primary">
              确认
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};