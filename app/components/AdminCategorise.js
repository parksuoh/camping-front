'use client'
import { useEffect, useState } from "react"
import { useCookies } from 'react-cookie';
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";

export default function AdminCategoryList() {
    const [data, setData] = useState([]);
    const [ cookies, setCookie, removeCookie ] = useCookies(['access_token']);
    const router = useRouter();

    useEffect(() => {
        getData();
    }, []);


    const getData = async() => {

        const response = await fetch("/api/admin/category", {
            method: "GET",
            headers: {
                "Authorization": 'Bearer '+cookies.access_token
            },
        });
        if(response.status === 200) {
            const jsonData = await response.json();
            setData(jsonData)
        }else {
            console.log('불러오기 실패')
        }
    }

    const onDelete = async(delId) => {
        const response = await fetch(`/api/admin/category/${delId}`, {
            method: "DELETE",
            headers: {
                "Authorization": 'Bearer '+cookies.access_token
            },
        });
        if(response.status === 200) {
            getData()
        }else {
            console.log('삭제 실패')
        }
    }



  return (
    <div className="flex flex-col border-2 items-center">
        <h1 className="my-3 font-bold">
            카테고리 리스트
        </h1>
        <Button 
            variant="ghost"
            onClick={() => router.push('/admin/category/create')}
        >
            카테고리 생성
        </Button>
        <div>
            {data.length > 0 && (
                data.map((item) => (
                    <CategoryItem 
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        onDelete={onDelete}
                    />
                ))

            )}
        </div>
    </div>
  )
}

const CategoryItem = ({
    id,
    name,
    onDelete
}) => {


    return <div className="flex my-3 gap-x-5 items-center">
        <div>아이디: {id}</div>
        <div>이름: {name}</div>
        <Button 
            variant="outline"
            onClick={() => onDelete(id)}
        >
            삭제
        </Button>
    </div>;
}