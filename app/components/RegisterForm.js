'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function RegisterForm({logined}) {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    useEffect(() => {
        if(logined) {
            router.push('/');
        }

    }, [])

    const valid = () => {
        if(!name) {
            console.log('이름을 입력해주세요');
            return false;
        }
        if(!password){
            console.log('비밀번호를 입력해주세요');
            return false;
        } 

        return true;
    }

    const onSubmit = async() => {
        if (valid()) {
            try{
                const response = await fetch("/api/user/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        password
                    }),
                });
                if(response.status === 201) {
                    console.log('회원가입 성공')
                    router.push('/user/login');
                } else {
                    console.log('회원가입 실패')
                }

            }catch(e){
                console.log(e)
            }

        }

    }


  return (
    <div className="flex flex-col border-2 items-center gap-y-5">
        <h1 className="my-3 font-bold">
            로그인
        </h1>
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
            회원가입
        </Button>
    </div>
  )
}
