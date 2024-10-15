export default function Layout({
  anonymous,
  authenticated,
}: {
  anonymous: React.ReactNode
  authenticated: React.ReactNode
}) {
  const isAuthenticated = false // Placeholder

  return <>{isAuthenticated ? authenticated : anonymous}</>
}
