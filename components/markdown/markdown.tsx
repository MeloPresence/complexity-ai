import React from "react"
import ReactMarkdown, { Components } from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { darcula as prismStyle } from "react-syntax-highlighter/dist/esm/styles/prism"
import rehypeKatex from "rehype-katex"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import "./animations.css"
import "./markdown.scss"
import "katex/dist/katex.min.css"

const remarkPlugins = [
  remarkGfm, // GitHub Flavored Markdown
  remarkMath, // Mathematical syntax
]

const rehypePlugins = [
  rehypeKatex, // Render mathematical syntax to HTML using KaTeX
]

export const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  const components: Partial<Components> = {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    code: ({ node, inline, className, children, ...props }: any) => {
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
          className={`${className} text-sm bg-zinc-100 dark:bg-zinc-800 py-0.5 px-1 rounded whitespace-normal`}
          {...props}
        >
          {children}
        </code>
      )
    },
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    ol: ({ node, children, ...props }: any) => {
      return (
        <ol className="list-decimal ml-4" {...props}>
          {children}
        </ol>
      )
    },
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    ul: ({ node, children, ...props }: any) => {
      return (
        <ul className="list-disc ml-4" {...props}>
          {children}
        </ul>
      )
    },
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    li: ({ node, children, ...props }: any) => {
      return (
        <li className="py-1" {...props}>
          {children}
        </li>
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

/* eslint-disable @typescript-eslint/no-explicit-any */

// Adapted from https://github.com/Ephibbs/flowtoken/blob/main/src/components/AnimatedMarkdown.tsx

interface SmoothTextProps {
  children: string
  sep?: string
  animation?: string | null
  animationDuration?: string
  animationTimingFunction?: string
}

interface AnimatedImageProps {
  src: string
  alt: string
  animation: string
  animationDuration: string
  animationTimingFunction: string
  animationIterationCount: number
}

interface CustomRendererProps {
  rows: any[]
  stylesheet: any
  useInlineStyles: boolean
}

const AnimatedImage: React.FC<AnimatedImageProps> = ({
  src,
  alt,
  animation,
  animationDuration,
  animationTimingFunction,
  animationIterationCount,
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false)

  const imageStyle = isLoaded
    ? {
        animationName: animation,
        animationDuration: animationDuration,
        animationTimingFunction: animationTimingFunction,
        animationIterationCount: animationIterationCount,
        whiteSpace: "pre-wrap",
      }
    : {
        display: "none",
      }

  return (
    <img
      src={src}
      alt={alt}
      onLoad={() => setIsLoaded(true)}
      style={imageStyle}
    />
  )
}

const TokenizedText = ({
  input,
  sep,
  animation,
  animationDuration,
  animationTimingFunction,
  animationIterationCount,
}: any) => {
  const tokens = React.useMemo(() => {
    if (typeof input !== "string") return null

    let splitRegex
    if (sep === "word") {
      splitRegex = /(\s+)/
    } else if (sep === "char") {
      splitRegex = /(.)/
    } else {
      throw new Error("Invalid separator")
    }

    return input
      .replace(/^[\r\n]+/g, "")
      .split(splitRegex)
      .filter((token) => token.length > 0)
  }, [input, sep])

  return (
    <>
      {tokens?.map((token, index) => (
        <span
          key={index}
          style={{
            animationName: animation,
            animationDuration,
            animationTimingFunction,
            animationIterationCount,
            whiteSpace: "pre-wrap",
            display: "inline-block",
          }}
          data-dev-src="TokenizedText"
        >
          {token}
        </span>
      ))}
    </>
  )
}

export const NonMemoizedAnimatedMarkdown = ({
  children,
  sep = "word",
  animation = "fadeIn",
  animationDuration = "1s",
  animationTimingFunction = "ease-in-out",
}: SmoothTextProps) => {
  const animationStyle: any = {
    "--marker-animation": `${animation} ${animationDuration} ${animationTimingFunction}`,
  }
  // Memoize animateText function to prevent recalculations if props do not change
  const animateText: (text: string | Array<any>) => React.ReactNode =
    React.useCallback(
      (text: string | Array<any>) => {
        const processText: (input: any) => React.ReactNode = (input: any) => {
          if (Array.isArray(input)) {
            // Process each element in the array
            return input.map((element) => processText(element))
          } else if (typeof input === "string") {
            return (
              <TokenizedText
                input={input}
                sep={sep}
                animation={animation}
                animationDuration={animationDuration}
                animationTimingFunction={animationTimingFunction}
                animationIterationCount={1}
              />
            )
          } else if (React.isValidElement(input)) {
            // If the element is a React component or element, clone it and process its children
            return input
          } else {
            // Return non-string, non-element inputs unchanged (null, undefined, etc.)
            return input
          }
        }
        if (!animation) {
          return text
        }
        return processText(text)
      },
      [animation, animationDuration, animationTimingFunction, sep],
    )

  const codeBlockRenderer = ({
    rows,
    stylesheet,
    useInlineStyles,
  }: CustomRendererProps) => {
    return rows.map((node, i) => (
      <div key={i} style={node.properties?.style || {}}>
        {node.children.map((token: any, key: string) => {
          // Extract and apply styles from the stylesheet if available and inline styles are used
          const tokenStyles =
            useInlineStyles && stylesheet
              ? {
                  ...stylesheet[token?.properties?.className[1]],
                  ...token.properties?.style,
                }
              : token.properties?.style || {}
          return (
            <span
              key={key}
              style={tokenStyles}
              data-dev-src="codeBlockRenderer.outer"
            >
              {token.children &&
                token.children[0].value
                  .split(" ")
                  .map((word: string, index: number) => (
                    <span
                      key={index}
                      style={{
                        animationName: animation || "",
                        animationDuration,
                        animationTimingFunction,
                        animationIterationCount: 1,
                        whiteSpace: "pre-wrap",
                        display: "inline-block",
                      }}
                      data-dev-src="codeBlockRenderer.inner"
                    >
                      {word +
                        (index < token.children[0].value.split(" ").length - 1
                          ? " "
                          : "")}
                    </span>
                  ))}
            </span>
          )
        })}
      </div>
    ))
  }

  // Memoize components object to avoid redefining components unnecessarily
  const components: Partial<Components> = React.useMemo(
    () => ({
      text: ({ node, ...props }: any) => <>{animateText(props.children)}</>,
      h1: ({ node, ...props }: any) => (
        <h1 {...props}>{animateText(props.children)}</h1>
      ),
      h2: ({ node, ...props }: any) => (
        <h2 {...props}>{animateText(props.children)}</h2>
      ),
      h3: ({ node, ...props }: any) => (
        <h3 {...props}>{animateText(props.children)}</h3>
      ),
      h4: ({ node, ...props }: any) => (
        <h4 {...props}>{animateText(props.children)}</h4>
      ),
      h5: ({ node, ...props }: any) => (
        <h5 {...props}>{animateText(props.children)}</h5>
      ),
      h6: ({ node, ...props }: any) => (
        <h6 {...props}>{animateText(props.children)}</h6>
      ),
      p: ({ node, ...props }: any) => (
        <p {...props}>{animateText(props.children)}</p>
      ),
      ol: ({ node, children, ...props }: any) => {
        return (
          <ol className="list-decimal ml-4" {...props}>
            {children}
          </ol>
        )
      },
      ul: ({ node, children, ...props }: any) => {
        return (
          <ul className="list-disc ml-4" {...props}>
            {children}
          </ul>
        )
      },
      li: ({ node, ...props }: any) => (
        <li {...props} className="custom-li py-1" style={animationStyle}>
          {animateText(props.children)}
        </li>
      ),
      a: ({ node, ...props }: any) => (
        <a
          {...props}
          href={props.href}
          target={props.href.startsWith("#") ? "_self" : "_blank"}
          rel={props.href.startsWith("#") ? "" : "noopener noreferrer"}
        >
          {animateText(props.children)}
        </a>
      ),
      strong: ({ node, ...props }: any) => (
        <strong {...props}>{animateText(props.children)}</strong>
      ),
      em: ({ node, ...props }: any) => (
        <em {...props}>{animateText(props.children)}</em>
      ),
      code: ({ node, inline, className, children, ...props }: any) => {
        const match = /language-(\w+)/.exec(className || "")

        return !inline && match ? (
          <div {...props} style={animationStyle} className="code-block">
            <SyntaxHighlighter
              language={match[1]}
              style={prismStyle}
              renderer={codeBlockRenderer}
            >
              {children}
            </SyntaxHighlighter>
          </div>
        ) : (
          <code
            className={`${className} text-sm bg-zinc-100 dark:bg-zinc-800 py-0.5 px-1 rounded whitespace-normal`}
            {...props}
          >
            {animateText(children)}
          </code>
        )
      },
      hr: ({ node, ...props }: any) => (
        <hr
          {...props}
          style={{
            animationName: animation,
            animationDuration,
            animationTimingFunction,
            animationIterationCount: 1,
            whiteSpace: "pre-wrap",
          }}
        />
      ),
      img: ({ node, ...props }: any) => (
        <AnimatedImage
          src={props.src}
          alt={props.alt}
          animation={animation || ""}
          animationDuration={animationDuration}
          animationTimingFunction={animationTimingFunction}
          animationIterationCount={1}
        />
      ),
      table: ({ node, ...props }: any) => (
        <table {...props} className="code-block">
          {props.children}
        </table>
      ),
      tr: ({ node, ...props }: any) => (
        <tr {...props}>{animateText(props.children)}</tr>
      ),
      td: ({ node, ...props }: any) => (
        <td {...props}>{animateText(props.children)}</td>
      ),
    }),
    [animateText],
  )

  return (
    <ReactMarkdown {...{ components, remarkPlugins, rehypePlugins }}>
      {children}
    </ReactMarkdown>
  )
}

export const AnimatedMarkdown = React.memo(
  NonMemoizedAnimatedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children,
)
