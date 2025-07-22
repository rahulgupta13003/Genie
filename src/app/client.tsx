"use client";  // ✅ Must be lowercase

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export const Client = () => {
  // ✅ Get the tRPC client
  const trpc = useTRPC();

  // ✅ Correct suspense query usage
  const { data } = useSuspenseQuery(
    trpc.createAI.queryOptions({ text: "Rahul PREFETCH" })
  );

  return <div>{JSON.stringify(data)}</div>;
};
