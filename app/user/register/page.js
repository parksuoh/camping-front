import RegisterForm from "@/app/components/RegisterForm";
import { headers } from 'next/headers'

export default function registerPage () {
  const headersList = headers()
  const logined = headersList.get('logined') === "true" ? true : false;


  return (
    <div>
      <RegisterForm logined={logined}/>
    </div>
  )
}

