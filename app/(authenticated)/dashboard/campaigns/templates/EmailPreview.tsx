import type { EmailElement } from "@/lib/types/email";
import { cn } from "@/lib/utils";

interface EmailPreviewProps {
    elements: EmailElement[];
}

export function EmailPreview({ elements }: EmailPreviewProps) {
    return (
        <div className="border rounded-lg p-8 ">
            <div className="max-w-2xl mx-auto">
                {elements.map((element, index) => {
                    const style = {
                        ...element.styles,
                        margin: `${element.styles.marginTop || 0} ${element.styles.marginRight || 0} ${element.styles.marginBottom || 0
                            } ${element.styles.marginLeft || 0}`,
                        padding: `${element.styles.paddingTop || 0} ${element.styles.paddingRight || 0} ${element.styles.paddingBottom || 0
                            } ${element.styles.paddingLeft || 0}`,
                        border: element.styles.borderWidth
                            ? `${element.styles.borderWidth} ${element.styles.borderStyle} ${element.styles.borderColor}`
                            : undefined,
                    };

                    switch (element.type) {
                        case "h1":
                            return (
                                <h1
                                    key={index}
                                    className={cn("text-4xl font-bold", element.styles.className)}
                                    style={style}
                                >
                                    {element.content}
                                </h1>
                            );
                        case "h2":
                            return (
                                <h2
                                    key={index}
                                    className={cn(
                                        "text-3xl font-semibold",
                                        element.styles.className,
                                    )}
                                    style={style}
                                >
                                    {element.content}
                                </h2>
                            );
                        case "h3":
                            return (
                                <h3
                                    key={index}
                                    className={cn(
                                        "text-2xl font-semibold",
                                        element.styles.className,
                                    )}
                                    style={style}
                                >
                                    {element.content}
                                </h3>
                            );
                        case "paragraph":
                            return (
                                <p
                                    key={index}
                                    className={cn("text-base", element.styles.className)}
                                    style={style}
                                >
                                    {element.content}
                                </p>
                            );
                        case "image":
                            return (
                                <img
                                    key={index}
                                    src={element.content}
                                    alt="Email content"
                                    className={cn("max-w-full h-auto", element.styles.className)}
                                    style={style}
                                />
                            );
                        case "button":
                            return (
                                <button
                                    key={index}
                                    className={cn(
                                        "px-4 py-2 rounded",
                                        element.styles.variant === "default"
                                            ? "bg-primary text-primary-foreground"
                                            : "",
                                        element.styles.className,
                                    )}
                                    style={style}
                                >
                                    {element.content}
                                </button>
                            );
                        default:
                            return null;
                    }
                })}

                {elements.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                        Add elements to preview your email template
                    </div>
                )}
            </div>
        </div>
    );
}
