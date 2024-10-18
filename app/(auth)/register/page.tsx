// import Link from "next/link"

// export default function RegisterPage() {
//   return (
//     <div>
//       <p>Register page placeholder</p>
//       <p>
//         <Link href="/login">Go to login</Link>
//       </p>
//       <p>
//         <Link href="/">Go to chat</Link>
//       </p>
//     </div>
//   )
// }

import Link from "next/link"

import SignUp from '@/components/signup';

export default function SignUpPage() {
  return <SignUp />;
}
