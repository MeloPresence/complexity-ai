import React from "react"
import ReactMarkdown, { Components } from "react-markdown"
import remarkGfm from "remark-gfm"

export const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  const remarkPlugins = [
    remarkGfm, // GitHub Flavored Markdown
  ]

  const components: Partial<Components> = {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    code: ({ inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || "")
      return !inline && match ? (
        <pre
          {...props}
          className={`${className} text-sm w-[80dvw] md:max-w-[500px] overflow-x-scroll bg-zinc-100 p-2 rounded mt-2 dark:bg-zinc-800`}
        >
          <code className={match[1]}>{children}</code>
        </pre>
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
    <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
      {children}
    </ReactMarkdown>
  )
}

export const Markdown = React.memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children,
)
