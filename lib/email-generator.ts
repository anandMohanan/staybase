import type { EmailElement } from "@/lib/types/email";

export function generateReactEmail(elements: EmailElement[]): string {
    const imports = `import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';`;

    const content = elements
        .map((element) => {
            const computedStyles = {
                ...element.styles,
                margin: `${element.styles.marginTop || 0} ${element.styles.marginRight || 0} ${element.styles.marginBottom || 0
                    } ${element.styles.marginLeft || 0}`,
                padding: `${element.styles.paddingTop || 0} ${element.styles.paddingRight || 0} ${element.styles.paddingBottom || 0
                    } ${element.styles.paddingLeft || 0}`,
                border: element.styles.borderWidth
                    ? `${element.styles.borderWidth} ${element.styles.borderStyle} ${element.styles.borderColor}`
                    : undefined,
            };

            const styleString = `{${Object.entries(computedStyles)
                .filter(
                    ([key]) =>
                        ![
                            "variant",
                            "marginTop",
                            "marginRight",
                            "marginBottom",
                            "marginLeft",
                            "paddingTop",
                            "paddingRight",
                            "paddingBottom",
                            "paddingLeft",
                        ].includes(key),
                )
                .map(([key, value]) => `${key}: "${value}"`)
                .join(",")}}`;

            switch (element.type) {
                case "heading":
                    return `      <Heading style=${styleString}>{/* Dynamic heading content */}</Heading>`;
                case "paragraph":
                    return `      <Text style=${styleString}>{/* Dynamic paragraph content */}</Text>`;
                case "image":
                    return `      <Img src="${element.content}" alt="" style=${styleString} />`;
                case "link":
                    return `      <Button href="#" style=${styleString}>{/* Dynamic button/link text */}</Button>`;
                default:
                    return "";
            }
        })
        .join("\n");

    return `${imports}

export default function Email() {
  return (i
    <Html>
      <Head />
      <Preview>Your Email Preview</Preview>
      <Body style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <Container>
          <Section>
${content}
          </Section>
        </Container>
      </Body>
    </Html>
  );
}`;
}
