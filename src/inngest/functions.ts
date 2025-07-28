import { Sandbox} from "@e2b/code-interpreter"
import { openai, createAgent } from "@inngest/agent-kit";
//import { gemini, createAgent } from "@inngest/agent-kit";

import { inngest } from "./client";
import { getSandbox } from "./utils";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("genie2-nextjs-test-2");
      return sandbox.sandboxId;
    });

     const codeAgent = createAgent({
      name: "code-Agent",
      system: "You are an expert next.js developer.  You write readable, maintainable, and efficient code. You write simple Next.js and react snippets",
      model: openai({ model: "gpt-4o-mini" }),
    });

    const { output } = await codeAgent.run(
    `Write the following snippets: ${event.data.value}`,
  );

    const sandboxUrl =await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`;
    })
    return {output, sandboxUrl, sandboxId};
    },
);