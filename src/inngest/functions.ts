import { openai, createAgent } from "@inngest/agent-kit";
//import { gemini, createAgent } from "@inngest/agent-kit";

import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event }) => {
     const codeAgent = createAgent({
      name: "code-Agent",
      system: "You are an expert next.js developer.  You write readable, maintainable, and efficient code. You write simple Next.js and react snippets",
      model: openai({ model: "gpt-4o-mini" }),
    });

    const { output } = await codeAgent.run(
    `Write the following snippets: ${event.data.value}`,
  );
    return {output}
    },
);