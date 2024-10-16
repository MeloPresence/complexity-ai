import React from "react"
import ReactMarkdown, { Components } from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { darcula as prismStyle } from "react-syntax-highlighter/dist/esm/styles/prism"
import rehypeKatex from "rehype-katex"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import "katex/dist/katex.min.css"

export const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  const remarkPlugins = [
    remarkGfm, // GitHub Flavored Markdown
    remarkMath, // Mathematical syntax
  ]

  const rehypePlugins = [
    rehypeKatex, // Render mathematical syntax to HTML using KaTeX
  ]

  const components: Partial<Components> = {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    code: ({ inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || "")
      return !inline && match ? (
        <SyntaxHighlighter
          PreTag="div"
          language={match[1]}
          style={prismStyle}
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code
          className={`${className} text-sm bg-zinc-100 dark:bg-zinc-800 py-0.5 px-1 rounded`}
          {...props}
        >
          {children}
        </code>
      )
    },
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    ol: ({ children, ...props }: any) => {
      return (
        <ol className="list-decimal list-inside ml-4" {...props}>
          {children}
        </ol>
      )
    },
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    li: ({ children, ...props }: any) => {
      return (
        <li className="py-1" {...props}>
          {children}
        </li>
      )
    },
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    ul: ({ children, ...props }: any) => {
      return (
        <ul className="list-decimal list-inside ml-4" {...props}>
          {children}
        </ul>
      )
    },
  }

  return (
    <ReactMarkdown {...{ components, remarkPlugins, rehypePlugins }}>
      {children}
    </ReactMarkdown>
  )
}

export const Markdown = React.memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children,
)
