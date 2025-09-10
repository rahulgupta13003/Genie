"use client";

import { TreeItem } from "@/types";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarProvider,
    SidebarRail,
} from "@/components/ui/sidebar";
import { ChevronRightIcon, FileIcon, FolderIcon } from "lucide-react";
import { CollapsibleContent, Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";


interface TreeViewProps {
    data: TreeItem[];
    value: string | null;
    // Next client entry point: function props must be named like Action
    onSelectAction: (path: string) => void;
}


export const TreeView = ({ data, value, onSelectAction }: TreeViewProps) => {
  return (
    <SidebarProvider>
        <Sidebar collapsible="none" className="w-full">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {data.map((item, index) => (
                                <Tree
                                key={index}
                                item={item}
                                selectedValue={value}
                                onSelectAction={onSelectAction}
                                parentPath=""
                                />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    </SidebarProvider>
  )
};

interface TreeProps {
    item: TreeItem;
    selectedValue?: string | null;
    onSelectAction: (path: string) => void;
    parentPath?: string;
}

const Tree = ({ item, selectedValue, onSelectAction, parentPath }: TreeProps) => {
    const [name, ...items] = Array.isArray(item) ? item : [item];
    const currentPath = parentPath ? `${parentPath}/${name}` : name;

    if(!items.length){
        const isSelected = selectedValue === currentPath;
        return (
            <SidebarMenuButton
            isActive={isSelected}
            className="data-[active=true] bg-transparent"
            onClick={() => onSelectAction(currentPath)}
            >
                <FileIcon />
                <span className="truncate">{name}</span>
            </SidebarMenuButton>
        )
    }
        // It's a folder
    return (
        <SidebarMenuItem>
            <Collapsible className="group/collapsible [&[data-state=open]>button>svg:first-child:rotate-90"
                defaultOpen>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                        <ChevronRightIcon className="transition-transform"/>
                        <FolderIcon />
                        <span className="truncate">
                            {name}
                        </span>
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {items.map((subItem,index)=> (
                            <Tree
                                key={index}
                            item={subItem}
                            selectedValue={selectedValue}
                            onSelectAction={onSelectAction}
                            parentPath={currentPath}
                            />
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenuItem>
    );

}
