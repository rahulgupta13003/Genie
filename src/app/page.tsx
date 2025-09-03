"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const router = useRouter();
  const [value, setValue] = useState("");

  const trpc = useTRPC();
  const createProject = useMutation(trpc.projects.create.mutationOptions({
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      router.push(`/project/${data.id}`);
    },
  }));

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-4">
      <div className="max-w-lg w-full flex flex-col gap-y-4 justify center">
      <Input value={value} onChange={(e) => setValue(e.target.value)}/>
      <Button 
      disabled={createProject.isPending} 
      onClick={() => createProject.mutate({ value: value })}>
        Submit
      </Button>
    </div>
    </div>
  );
};

export default Page;
