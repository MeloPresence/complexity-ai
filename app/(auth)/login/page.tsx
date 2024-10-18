// import Link from "next/link"

// export default function LoginPage() {
//   return (
//     <div>
//       <p>Login page placeholder</p>
//       <p>
//         <Link href="/register">Go to register</Link>
//       </p>
//       <p>
//         <Link href="/forget-password">Go to forget password</Link>
//       </p>
//       <p>
//         <Link href="/">Go to chat</Link>
//       </p>
//     </div>
//   )
// }

import Link from "next/link"

import Login from '@/components/login';

export default function LoginPage() {
  return <Login />;
}
