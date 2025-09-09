import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextareaAutoSixer from "react-textarea-autosize";
import { z } from "zod";
import {toast} from "sonner";
import  {useState} from "react";
import {ArrowUpIcon, Loader2Icon} from "lucide-react";
import {  useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";


interface Props{
    projectId: string;
};

const formSchema = z.object({
    value: z.string()
        .min(1, { message: "Message is required" })
        .max(10000, { message: "Message is too long" }),
})

export const MessageForm = ({ projectId }: Props) => {

    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            value: "",
        },
    });

    const createMessage = useMutation(trpc.messages.create.mutationOptions({
        onSuccess: (data) => {
            form.reset();
            queryClient.invalidateQueries(
                trpc.messages.getMany.queryOptions({ projectId })
            );
            //TODO: Invalidate project query to update updatedAt
        },
            onError: (error) => {
                //TODO: Redirect to pricing page if specific error
                toast.error(error.message);
        }
    }));

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        await createMessage.mutateAsync({
            value: values.value,
            projectId,
        });
    };

    const [isFocused, setIsFocused] = useState(false);
    const isPending = createMessage.isPending;
    const isButtonDisabled = isPending || !form.formState.isValid;
    const showUsage = false;
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
            className={cn(
                "relative border p-4 rounded-xl bg-sidebar dark:bg-sidebar trasition:all",
                isFocused && "shadow-xs",
                showUsage && "rounded-none"
            )}
            >
                <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                        <TextareaAutoSixer
                            {...field}
                            disabled={isPending}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            minRows={2}
                            maxRows={8}
                            className="pt-4 resize-none border-none w-full outline-none bg-transparent"
                            placeholder="What would you like to build?"
                            onKeyDown={(e)=>{
                                if(e.key ==="Enter") {
                                    e.preventDefault();
                                    form.handleSubmit(onSubmit)(e);
                                }
                            }}
                        />
                    )}
                />
                <div className = "flex gap-x-2 items-end justify-between pt-2">
                    <div className= "text-[10px] text-muted-foreground font-mono">
                        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                            <span>&#8984;</span>Enter
                        </kbd>
                        &nbsp;to submit
                    </div>
                    <Button
                    disabled={isButtonDisabled}
                    className= {cn(
                        "size-8 p-0 rounded-full",
                        isButtonDisabled && "bg-muted-foreground border",
                    )}
                    >
                        {isPending ? (
                            <Loader2Icon className="size-4 animate-spin" />
                        ) : (
                            <ArrowUpIcon />
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}