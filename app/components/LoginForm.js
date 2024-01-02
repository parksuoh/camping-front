'use client';

import { useEffect, useState } from "react";
import { useCookies } from 'react-cookie';
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"



export default function LoginForm({logined}) {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [ cookies, setCookie, removeCookie ] = useCookies(['access_token']);
    const router = useRouter();

    useEffect(() => {
        if(logined) {
            router.push('/');
        }

    }, [])

    const valid = () => {
        if(!name) {
            alert('이름을 입력해주세요');
            return false;
        }
        if(!password){
            alert('비밀번호를 입력해주세요');
            return false;
        } 

        return true;
    }

    const onSubmit = async() => {
        if (valid()) {
            const response = await fetch("/api/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    password
                }),
            });
            if(response.status === 200) {
                const jsonData = await response.json();
                setCookie('access_token', jsonData.token);
                location.reload();
            } else {
                console.log('로그인 실패')
            }

        }

    }



  return (
    <div className="flex flex-col border-2 items-center gap-y-5">
        <h1 className="my-3 font-bold">
            로그인
        </h1>

        <h2>
            (관리자계정: admin , 관리자비밀번호: 1234)
        </h2>

        <Input 
            type="text"
            placeholder='이름을 입력해주세요'
            value={name}
            onChange={e => setName(e.target.value)}
            className="max-w-xs"
        />

        <Input 
            type="password"
            placeholder='비밀번호를 입력해주세요'
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="max-w-xs"
        />

        <Button
            onClick={() => onSubmit()}
        >
            로그인
        </Button>
        <Button
            variant="secondary"
            onClick={() => router.push('/user/register')}
        >
            회원가입 하기
        </Button>
    </div>
  )
}
