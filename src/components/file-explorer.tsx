import {CopyCheckIcon, CopyIcon, RefreshCcwIcon} from "lucide-react";
import {useState,useCallback,useMemo,Fragment} from "react";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import {CodeView} from "@/components/code-view";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    BreadcrumbEllipsis
} from "@/components/ui/breadcrumb";
import { convertFilesToTreeItems } from "@/lib/utils";
import { TreeView } from "./tree-view";
import { set } from "date-fns";

type FileCollection = {[path: string]: string};

function getLanugageFromExtension(filename: string): string {
    const extension = filename.split(".").pop()?.toLowerCase();
    return extension || "text";
};

interface FileBreadcrumbProps {
    filepath: string;
}

const FileBreadcrumb = ({ filepath }: FileBreadcrumbProps) => {
    if (!filepath) return null;

    const pathSegments = filepath.split("/").filter(Boolean);
    const maxSegments = 4;

    if (pathSegments.length === 0) return null;

    const renderItems = () => {
        if (pathSegments.length <= maxSegments) {
            return pathSegments.map((segment, index) => {
                const isLast = index === pathSegments.length - 1;
                return (
                    <Fragment key={index}>
                        <BreadcrumbItem>
                            {isLast ? (
                                <BreadcrumbPage className="font-medium">{segment}</BreadcrumbPage>
                            ) : (
                                <span className="text-muted-foreground ">{segment}</span>
                            )}
                        </BreadcrumbItem>
                        {!isLast && <BreadcrumbSeparator />}
                    </Fragment>
                );
            });
        }

        // Long path: show first, ellipsis, last
        const first = pathSegments[0];
        const last = pathSegments[pathSegments.length - 1];

        return (
            <>
                <BreadcrumbItem>
                    <span className="text-muted-foreground ">{first}</span>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbEllipsis />
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage className="font-medium">{last}</BreadcrumbPage>
                </BreadcrumbItem>
            </>
        );
    };

    return (
        <Breadcrumb>
            <BreadcrumbList>{renderItems()}</BreadcrumbList>
        </Breadcrumb>
    );
};

interface FileExplorerProps{
    files: FileCollection;
    filePath: string;
    onFilePathChange: (path: string) => void;
}

export const FileExplorer = ({ files, filePath, onFilePathChange }: FileExplorerProps) => {
    const [copied, setCopied] = useState(false);
    const [selectedFile, setSelectedFile] = useState<string | null>(() =>{
        const fileKey = Object.keys(files);
        return fileKey.length > 0 ? fileKey[0] : null;
    });

    const treeData = useMemo(() => {
        return convertFilesToTreeItems(files);
    },[files]);

    const handleFileSelect = useCallback((path: string) => {
        if(files[path]){
            setSelectedFile(path);
            onFilePathChange(path);
        }

    },[files, onFilePathChange])

    const handleCopy = useCallback(() => {
        if(selectedFile && files[selectedFile]){
            navigator.clipboard.writeText(files[selectedFile]);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    },[selectedFile, files]);

    return(
        <ResizablePanelGroup direction={"horizontal"}>
            <ResizablePanel defaultSize={30} minSize={20} className="bg-sidebar">
                <TreeView 
                data={treeData}
                value={selectedFile}
                onSelectAction={handleFileSelect}
                />
            </ResizablePanel>
            <ResizableHandle className="hover:bg-primary transition-colors"/>
            <ResizablePanel defaultSize={70} minSize={50} >
                {selectedFile && files[selectedFile] ?(
                    <div className="h-full w-full flex flex-col">
                        <div className="border-b bg-sidebar px-4 py-2 flex items-center gap-x-2">
                            <div className="flex-1 min-w-0">
                                <FileBreadcrumb filepath={selectedFile} />
                            </div>
                            <Hint text="Copy to clipboard" side="bottom">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleCopy}
                                    disabled={copied}
                                >
                                    {copied ? <CopyCheckIcon/> : <CopyIcon />}
                                </Button>
                            </Hint>
                        </div>
                        <div className="flex-1 overflow-auto">
                            <CodeView
                            code={files[selectedFile]}
                            lang={getLanugageFromExtension(selectedFile)}
                            />


                        </div>
                    </div>
                ):(
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        Select a file to view its content
                    </div>
                )}
            </ResizablePanel>

        </ResizablePanelGroup>
    );
}
    
