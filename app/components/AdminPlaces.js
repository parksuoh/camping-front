'use client'
import { useEffect, useState } from "react"
import { useCookies } from 'react-cookie';
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { Button } from "@/components/ui/button";


export default function AdminPlaceList() {
    const [data, setData] = useState([]);
    const [ cookies, setCookie, removeCookie ] = useCookies(['access_token']);
    const router = useRouter();

    useEffect(() => {
        getData();
    }, []);
  
  
    const getData = async() => {
  
        const response = await fetch("/api/admin/place", {
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
        const response = await fetch(`/api/admin/place/${delId}`, {
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
            장소 리스트
        </h1>
        <Button
            variant="ghost"
            onClick={() => router.push('/admin/place/create')}
        >            
             생성
        </Button>
        {data.length > 0 && (
            data.map((item) => (
                <PlaceItem 
                    key={item.id}
                    placeId={item.placeId}
                    name={item.name}
                    price={item.price}
                    onDelete={onDelete}
                />
            ))

        )}
    </div>
  )
}


const PlaceItem = ({
    placeId,
    name,
    price,
    onDelete
}) => {
    const router = useRouter();

    return <div className="flex my-3 gap-x-5 items-center">
            <div>아이디: {placeId}</div>
            <Button variant="outline" onClick={() => router.push(`/admin/place/detail/${placeId}`)}>이름: {name}</Button>
            <div>가격: {price}</div>
            <Button 
                variant="outline"
                onClick={() => onDelete(placeId)}
            >
                삭제
            </Button>
        </div>;
}