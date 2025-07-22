import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    //waiting for transcrbing
    await step.sleep("wait-a-moment", "5s");
    //waiting for summary
    await step.sleep("wait-a-moment", "5s");
    return { message: `Hello ${event.data.email}!` };
  },
);