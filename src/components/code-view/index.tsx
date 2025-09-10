"use client";

import { useEffect, useRef } from "react";
import "./code-theme.css";

interface Props {
    code: string;
    lang: string;
}

export const CodeView = ({ code, lang }: Props) => {
    const codeRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const Prism = (await import("prismjs"))?.default;

                // Dynamically load only the languages we might need. Importing these modules
                // doesn't export value we need; they register themselves with Prism.
                const imports: Promise<any>[] = [];
                // load common languages used in the app
                imports.push(import("prismjs/components/prism-javascript"));
                imports.push(import("prismjs/components/prism-jsx"));
                imports.push(import("prismjs/components/prism-typescript"));
                imports.push(import("prismjs/components/prism-tsx"));
                imports.push(import("prismjs/components/prism-python"));

                await Promise.all(imports);

                if (!mounted) return;
                if (codeRef.current && Prism && Prism.highlightElement) {
                    Prism.highlightElement(codeRef.current as Element);
                }
            } catch (e) {
                // silently ignore highlight failures on client
                // console.debug("Prism load/highlight failed", e);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [code, lang]);

    return (
        <pre className="p-2 bg-transparent border-none rounded-none m-0 text-xs">
            <code ref={codeRef} className={`language-${lang}`}>
                {code}
            </code>
        </pre>
    );
};
