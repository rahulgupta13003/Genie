import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextareaAutoSize from "react-textarea-autosize";
import { z } from "zod";
import {toast} from "sonner";
import  {useState} from "react";
import {ArrowUpIcon, Loader2Icon} from "lucide-react";
import {  useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { PROJECT_TEMPLATES } from "../../constants";


const formSchema = z.object({
    value: z.string()
        .min(1, { message: "Message is required" })
        .max(10000, { message: "Message is too long" }),
})

export const ProjectForm = () => {
    const router = useRouter();
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            value: "",
        },
    });

    const createProject = useMutation(trpc.projects.create.mutationOptions({
        onSuccess: (data) => {
            queryClient.invalidateQueries(
                trpc.projects.getMany.queryOptions()
            );
            router.push(`/project/${data.id}`);
            //TODO: Invalidate project query to update updatedAt
        },
            onError: (error) => {
                //TODO: Redirect to pricing page if specific error
                toast.error(error.message);
        }
    }));

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        await createProject.mutateAsync({
            value: values.value,
        });
    };

    const onSelect = (content: string) => {
        form.setValue("value", content, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
        });
    };
    const [isFocused, setIsFocused] = useState(false);
    const isPending = createProject.isPending;
    const isButtonDisabled = isPending || !form.formState.isValid;
    return (
        <Form {...form}>
            <section className="space-y-6">
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn(
                    "relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition:all",
                    isFocused && "rounded-t-none",
                )}
            >
                <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                        <TextareaAutoSize
                            {...field}
                            disabled={isPending}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            minRows={2}
                            maxRows={8}
                            aria-label="Project description"
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
                        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
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
                            <Loader2Icon className=" animate-spin" />
                        ) : (
                            <ArrowUpIcon className="h-5 w-5 " />
                        )}
                    </Button>
                </div>
            </form>
            <div className="flex-wrap justify-center gap-2 hidden md:flex max-w-3xl">
                {PROJECT_TEMPLATES.map((template)=>(
                    <Button
                    key={template.title}
                    variant="outline"
                    size="sm"
                    className="bg-white dark:bg-sidebar"
                    onClick={() => onSelect(template.prompt)}
                    >
                        {template.emoji} {template.title}
                    </Button>
                ))}
            </div>
            </section>
        </Form>
    );
}