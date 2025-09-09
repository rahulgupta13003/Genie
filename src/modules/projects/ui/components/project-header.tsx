import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  SunMoonIcon,
} from "lucide-react";

import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // ✅ use shadcn wrappers

interface Props {
  projectId: string;
}

export const ProjectHeader = ({ projectId }: Props) => {
  const trpc = useTRPC();
  const { data: project } = useSuspenseQuery(
    trpc.projects.getOne.queryOptions({ id: projectId })
  );

  const { theme, setTheme } = useTheme();

  return (
    <header className="p-2 border-b flex items-center justify-between">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="focus-visible:ring-0 hover:bg-transparent hover:opacity-75 transition-opacity pl-2"
          >
            <Image src="/logo.svg" alt="Genie" width={18} height={18} />
            <span className="text-sm font-medium">{project.name}</span>
            <ChevronDownIcon className="ml-1" size={16} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="bottom" align="start">
          <DropdownMenuItem asChild>
            <Link href="/" className="flex items-center gap-2">
              <ChevronLeftIcon className="size-4" />
              <span>Go to Dashboard</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="gap-2">
              <SunMoonIcon className="size-4 text-muted-foreground" />
              <span>Appearance</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={theme}
                onValueChange={setTheme}
              >
                <DropdownMenuRadioItem value="light">
                  Light
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">
                  Dark
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system">
                  System
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
