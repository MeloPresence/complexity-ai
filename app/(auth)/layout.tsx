export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <div>Auth Layout placeholder</div>
      <div>{children}</div>
    </div>
  )
}
