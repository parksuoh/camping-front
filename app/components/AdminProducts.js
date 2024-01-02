'use client'
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react"
import { useCookies } from 'react-cookie';
import { useRouter } from "next/navigation";
import Image from 'next/image';


export default function AdminProductList() {
    const [data, setData] = useState([]);
    const [ cookies, setCookie, removeCookie ] = useCookies(['access_token']);
    const router = useRouter();

    useEffect(() => {
        getData();
    }, []);


    const getData = async() => {

        const response = await fetch("/api/admin/product", {
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
        const response = await fetch(`/api/admin/product/${delId}`, {
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
            상품 리스트
        </h1>
        <Button
            variant="ghost"
            onClick={() => router.push('/admin/product/create')}
        >
            상품 생성
        </Button>
        {data.length > 0 && (
            data.map((item) => (
                <ProductItem 
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    price={item.price}
                    images={item.images}
                    onDelete={onDelete}
                />
            ))

        )}
    </div>
  )
}

const ProductItem = ({
    id,
    name,
    price,
    images,
    onDelete
}) => {
    const router = useRouter();

    return <div 
            className="flex my-3 gap-x-5 items-center"
        >
        <div>아이디: {id}</div>
        <Button variant="outline" onClick={() => router.push(`/admin/product/detail/${id}`)}>이름: {name}</Button>
        <div>가격: {price}</div>
        <Image
            src={images[0].url}
            width={100}
            height={100}
            alt={name}
        />
        <Button 
            variant="outline"
            onClick={() => onDelete(id)}
        >
            삭제
        </Button>
    </div>;
}