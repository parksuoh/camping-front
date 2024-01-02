'use client'
import { useState } from "react"
import { useCookies } from 'react-cookie';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation";



export default function AdminCreateCategory() {
    const [category, setCategory] = useState('');
    const [ cookies, setCookie, removeCookie ] = useCookies(['access_token']);
    const router = useRouter();

    
    const onSubmit = async() => {
        if(!category) return;

        try{
            const response = await fetch("/api/admin/category", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer '+cookies.access_token
                },
                body: JSON.stringify({
                    categoryName: category
                }),
            });
            if(response.status === 201) {
                alert('성공')
                router.push('/admin/category/list')
            } else {
                alert('실패')
            }

        }catch(e){
            console.log(e)
        }

    }


  return (
    <div className="flex flex-col border-2 items-center gap-y-5">
        <h1 className="my-3 font-bold">
            카테고리 생성
        </h1>
        <Input 
            type="text"
            placeholder='카테고리 이름을 입력해주세요'
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="max-w-xs"
        />

        <Button
            onClick={() => onSubmit()}
        >
            생성
        </Button>
    </div>
  )
}
