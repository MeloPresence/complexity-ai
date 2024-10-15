import Link from "next/link"

export default function ForgetPasswordPage() {
  return (
    <div>
      <p>Forget Password page placeholder</p>
      <p>
        <Link href="/login">Go to login</Link>
      </p>
      <p>
        <Link href="/register">Go to register</Link>
      </p>
      <p>
        <Link href="/">Go to chat</Link>
      </p>
    </div>
  )
}
