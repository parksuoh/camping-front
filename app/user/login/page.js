import LoginForm from "@/app/components/LoginForm";
import { headers } from 'next/headers'

export default function loginPage(){
    const headersList = headers()
    const logined = headersList.get('logined') === "true" ? true : false;

    return <div>
        <LoginForm logined={logined}/>
    </div>;
}