import { Flex, Heading, Section, Text } from "@radix-ui/themes";

export default function Template({
  title,
  description,
  children,
}: {
  title?: string;
  children?: React.ReactNode;
  description?: string;
}) {
  return (
    <div className="max-w-4xl p-4 mx-auto">
      <Flex
        direction="column"
        height="100%"
        width="100%"
        justify="center"
        align="center"
        p="4"
        className="fadeIn min-h-screen"
      >
        {title && <h1 className="text-3xl">{title}</h1>}
        {description && (
          <Section size="1">
            <Text size="6">{description}</Text>
          </Section>
        )}
        {children ? <Section size="1">{children}</Section> : null}
      </Flex>{" "}
    </div>
  );
}
