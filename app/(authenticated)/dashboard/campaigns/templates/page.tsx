"use client";

import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Type, Image, Link, Heading1, Heading2, Heading3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DraggableElement } from "./DraggableElement";
import { DroppableArea } from "./DroppableArea";
import { StyleEditor } from "./StyleEditor";
import { EmailPreview } from "./EmailPreview";
import type { EmailElement } from "@/lib/types/email";
import { generateReactEmail } from "@/lib/email-generator";
import { Input } from "@/components/ui/input";

const ELEMENT_TYPES = [
    { type: "h1", icon: Heading1, label: "Heading 1" },
    { type: "h2", icon: Heading2, label: "Heading 2" },
    { type: "h3", icon: Heading3, label: "Heading 3" },
    { type: "paragraph", icon: Type, label: "Paragraph" },
    { type: "image", icon: Image, label: "Image" },
    { type: "button", icon: Link, label: "Button" },
];

const DEFAULT_CONTENT = {
    h1: "Your Main Heading",
    h2: "Your Subheading",
    h3: "Your Section Heading",
    paragraph: "Your paragraph text goes here.",
    image: "https://source.unsplash.com/random/800x400",
    button: "Click Here",
};

export default function EmailBuilder() {
    const [elements, setElements] = useState<EmailElement[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [generatedHtml, setGeneratedHtml] = useState<string>("");

    const handleDrop = (item: { type: string }) => {
        const newElement: EmailElement = {
            type: item.type,
            content: DEFAULT_CONTENT[item.type as keyof typeof DEFAULT_CONTENT],
            styles: {
                fontSize: item.type.startsWith("h")
                    ? `${4 - parseInt(item.type[1])}rem`
                    : "1rem",
                color: "hsl(var(--foreground))",
                backgroundColor:
                    item.type === "button" ? "hsl(var(--primary))" : "transparent",
                textAlign: "left",
                fontWeight: item.type.startsWith("h") ? "bold" : "normal",
                variant: item.type === "button" ? "default" : undefined,
                paddingTop: "1rem",
                paddingRight: "1rem",
                paddingBottom: "1rem",
                paddingLeft: "1rem",
                marginTop: "1rem",
                marginRight: "0",
                marginBottom: "1rem",
                marginLeft: "0",
                borderWidth: "0",
                borderColor: "hsl(var(--border))",
                borderStyle: "solid",
                borderRadius: "0.5rem",
            },
        };
        setElements([...elements, newElement]);
    };

    const handleStyleChange = (property: string, value: string) => {
        if (selectedIndex === null) return;

        const newElements = [...elements];
        newElements[selectedIndex] = {
            ...newElements[selectedIndex],
            styles: {
                ...newElements[selectedIndex].styles,
                [property]: value,
            },
        };
        setElements(newElements);
    };

    const handleContentChange = (content: string) => {
        if (selectedIndex === null) return;

        const newElements = [...elements];
        newElements[selectedIndex] = {
            ...newElements[selectedIndex],
            content,
        };
        setElements(newElements);
    };
    const [templateName, setTemplateName] = useState<string>("");
    const [templateNameError, setTemplateNameError] = useState<boolean>(false);

    const renderInputEmptyAlert = () => {
        return (
            <Alert className="mb-2" variant={"destructive"}>
                <AlertDescription>
                    Please enter a name.
                </AlertDescription>
            </Alert>
        );
    };

    const handleExport = () => {
        if (templateName === "") {
            setTemplateNameError(true);
            return;
        }
        setTemplateNameError(false);

        const emailHtml = generateReactEmail(elements);
        setGeneratedHtml(emailHtml);
        const blob = new Blob([emailHtml], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "email-template.tsx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="container mx-auto py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Email Template Builder</h1>
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-2">
                            <Input
                                placeholder="Template Name"
                                value={templateName}
                                onChange={(e) => setTemplateName(e.target.value)}
                            />
                            {templateNameError && renderInputEmptyAlert()}
                        </div>
                        <Button onClick={handleExport}>Save Template</Button>
                    </div>
                </div>

                <Alert className="mb-8" variant={"destructive"}>
                    <AlertDescription>
                        Only image content is editable. Other content will be generated
                        dynamically when sending emails.
                    </AlertDescription>
                </Alert>

                <div className=" mb-8 overflow-x-auto p-4 rounded-lg">
                    <Alert className="mb-2" variant={"default"}>
                        <AlertDescription>
                            Drag the below elements and drop them into the area below to build
                            your email template. You will be able to edit the content and
                            style of each element and preview the final email template. Click
                            the save button to save the template.
                        </AlertDescription>
                    </Alert>
                    <div className="flex gap-4 overflow-x-auto rounded-lg">
                        {ELEMENT_TYPES.map((element) => (
                            <DraggableElement key={element.type} {...element} />
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-8">
                        <DroppableArea
                            elements={elements}
                            onDrop={handleDrop}
                            onElementSelect={setSelectedIndex}
                            selectedIndex={selectedIndex}
                        />
                    </div>

                    <div className="col-span-4">
                        <Tabs defaultValue="styles">
                            <TabsList className="w-full">
                                <TabsTrigger value="styles" className="flex-1">
                                    Styles
                                </TabsTrigger>
                                {selectedIndex !== null &&
                                    elements[selectedIndex]?.type === "image" && (
                                        <TabsTrigger value="content" className="flex-1">
                                            Content
                                        </TabsTrigger>
                                    )}
                                <TabsTrigger value="spacing" className="flex-1">
                                    Spacing
                                </TabsTrigger>
                            </TabsList>
                            {selectedIndex !== null && elements[selectedIndex] ? (
                                <>
                                    <TabsContent value="styles">
                                        <StyleEditor
                                            element={elements[selectedIndex]}
                                            onStyleChange={handleStyleChange}
                                            onContentChange={handleContentChange}
                                            tab="styles"
                                        />
                                    </TabsContent>
                                    {elements[selectedIndex].type === "image" && (
                                        <TabsContent value="content">
                                            <StyleEditor
                                                element={elements[selectedIndex]}
                                                onStyleChange={handleStyleChange}
                                                onContentChange={handleContentChange}
                                                tab="content"
                                            />
                                        </TabsContent>
                                    )}
                                    <TabsContent value="spacing">
                                        <StyleEditor
                                            element={elements[selectedIndex]}
                                            onStyleChange={handleStyleChange}
                                            onContentChange={handleContentChange}
                                            tab="spacing"
                                        />
                                    </TabsContent>
                                </>
                            ) : (
                                <div className="p-4 text-muted-foreground">
                                    Select an element to edit its properties
                                </div>
                            )}
                        </Tabs>
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-lg font-semibold mb-4">Preview</h2>
                    <EmailPreview elements={elements} />
                </div>

                <div className="mt-8">
                    <h2 className="text-lg font-semibold mb-4">
                        Generated React Email Template
                    </h2>
                    <div className="bg-muted rounded-lg p-4 overflow-auto max-h-[400px]">
                        <pre className="text-sm">
                            <code>{generatedHtml}</code>
                        </pre>
                    </div>
                </div>
            </div>
        </DndProvider>
    );
}
