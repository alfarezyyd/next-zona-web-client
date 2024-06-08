import Register from "@/components/auth/Register";
import AuthLayout from "@/components/AuthLayout";
import Login from "@/components/auth/Login";

export default function Page() {
  return (
    <AuthLayout>
      <Login/>
    </AuthLayout>
  )
}