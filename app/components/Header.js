'use client'
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

export default function Header({logined, headerRole, headerName}) {
    const router = useRouter();
    const [cateogys, setCategorys] = useState([])

    

    useEffect(() => {
        getData();
    }, []);


    const getData = async() => {

        const response = await fetch("/api/category");
        if(response.status === 200) {
            const jsonData = await response.json();
            setCategorys(jsonData)
        }else {
            console.log('불러오기 실패')
        }
    }


  return (
    <div className="border-b-2 border-gray-950 flex justify-between items-center px-10 py-10">
        <h1 className="text-lg font-bold" onClick={() => router.push('/')}>
            수오캠프 
        </h1>
        <div className="flex gap-x-1">
            {cateogys.length > 0 && cateogys.map(item => (
                <Button 
                    key={item.id}
                    variant="secondary"
                    onClick={() => router.push(`/product/list/${item.id}`)}
                >
                    {item.name}
                </Button>

            ))}
            <Button 
                variant="secondary"
                onClick={() => router.push('/place/list')}
            >
                장소
            </Button>
            {logined ? (
                <DropdownMenu>
                    <DropdownMenuTrigger>내정보</DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>{headerName}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push('/cart/list')}>카트</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push('/order/list')}>주문정보</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push('/place/reservation')}>예약정보</DropdownMenuItem>
                        {headerRole === "ROLE_ADMIN" && (
                            <DropdownMenuItem onClick={() => router.push('/admin/category/list')}>관리자</DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Button 
                    variant="secondary"
                    onClick={() => router.push('/user/login')}
                >
                    로그인
                </Button>
            )}



        </div>
        
    </div>
  )
}
