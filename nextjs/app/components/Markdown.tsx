import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { resolveHref, resolveSrc, withoutH1 } from "@/lib/content";

// Markdown from content/: relative links and images resolve from the file's own folder, and outside links open a new tab.
export default function Markdown({ content, dir = "" }: { content: string; dir?: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSlug]}
      components={{
        a: ({ href, children }) => {
          const resolved = /\.(?:pdf|png|jpe?g|gif|webp|svg)(?:[?#]|$)/i.test(href ?? "") ? resolveSrc(href, dir) : resolveHref(href, dir);
          const external = /^https?:\/\//i.test(resolved ?? "");
          return <a href={resolved} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>{children}</a>;
        },
        // eslint-disable-next-line @next/next/no-img-element
        img: ({ src, alt }) => <img src={resolveSrc(typeof src === "string" ? src : "", dir)} alt={alt ?? ""} loading="lazy" />,
      }}
    >
      {withoutH1(content)}
    </ReactMarkdown>
  );
}
