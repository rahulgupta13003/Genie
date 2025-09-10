"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";

export const ProjectList = () => {
    const trpc = useTRPC();
    const { data: projects } = useQuery(trpc.projects.getMany.queryOptions());

    return(
        <div className="bg-white dark:bg-sidebar rounded-xl p-8 border flex flex-col gap-y-6 sm:gap-y-4">
            <h2 className="text-2xl font-semibold">
                Saved Projects
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {projects?.length===0 && (
                    <div className="col-span-full text-center">
                        <p className="text-sm text-muted-foreground">
                            No projects yet. Create one above!
                        </p>
                    </div>
                )}
                {projects?.map((project) => (
                    <Button
                    key={project.id}
                    variant="outline"
                    className="font-normal justify-start text-start h-auto w-full p-4"
                    asChild
                    >
                        <Link href={`/project/${project.id}`} className="w-full">
                            <div className="flex items-center gap-x-4 p-4">
                                <Image
                                    src="/logo.svg"
                                    alt={project.name || "Project"}
                                    width={32}
                                    height={32}
                                    className="object-contain"
                                />
                                <div className="flex flex-col min-w-0">
                                    <h3 className="font-medium truncate">{project.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </Button>
                ))}
            </div>
        </div>
    );
};