interface TextProps {
    variant:
    | "largeHeader"
    | "header"
    | "description"
    | "body"
    | "caption"
    | "smallHeader";
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export const AppText = ({
    variant,
    style,
    children,
    className = "",
}: TextProps) => {
    const styles = {
        largeHeader: "text-4xl font-semibold text-text",
        header: "text-2xl font-semibold text-text",
        smallHeader: "text-xl font-semibold text-text",
        description: "text-sm text-text-secondary leading-relaxed font-light",
        body: "text-base text-text",
        caption: "text-xs text-light",
    };

    // Map variants to HTML tags for better SEO/Accessibility
    const Tag =
        variant === "largeHeader" ? "h1" : variant === "header" ? "h2" : "p";

    return (
        <Tag className={`${styles[variant]} ${className}`} style={style}>
            {children}
        </Tag>
    );
};
