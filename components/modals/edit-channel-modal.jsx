"use client";

import qs from "query-string";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChannelType } from "@prisma/client";
import { useEffect } from "react";

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "必须要有频道名",
    })
    .refine((name) => name !== "general"),
  type: z.nativeEnum(ChannelType),
});

export const EditChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const { channel, server } = data;
  const isModalOpen = isOpen && type === "editChannel";

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: channel?.name || "",
      type: channel?.type || ChannelType.TEXT,
    },
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (channel) {
      form.setValue("name", channel.name);
      form.setValue("type", channel.type);
    }
  }, [form, channel]);

  const onSubmit = async (values) => {
    try {
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel.id}`,
        query: {
          serverId: server?.id,
        },
      });
      await axios.patch(url, values);
      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogHeader className="text-2xl text-center font-bold text-indigo-900">
            编辑频道
          </DialogHeader>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      频道名
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-indigo-100 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="在此输入频道名..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="font-black" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>频道类型</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={channel?.type || ChannelType.TEXT}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                          <SelectValue placeholder="选择一个频道类型" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ChannelType).map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                            className="capitalize"
                          >
                            {type.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button disabled={isLoading} variant="primary">
                保存
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
