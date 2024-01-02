'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';

export default function Products({categoryId}) {
 
    const [data, setData] = useState([]);
    const [category, setCategory] = useState({})

    useEffect(() => {
        getData();
        getCategory();
    }, []);


    const getData = async() => {
        const response = await fetch(`/api/product/${categoryId}`, {
            method: "GET",
        });
        if(response.status === 200) {
            const jsonData = await response.json();
            setData(jsonData)
        }else {
            console.log('불러오기 실패')
        }
    }

    const getCategory = async() => {

        const response = await fetch("/api/category");
        if(response.status === 200) {
            const jsonData = await response.json();
            const filteredRes = jsonData.filter((item) => item.id === parseInt(categoryId));
            filteredRes.length > 0 && setCategory(filteredRes[0]);
            
        }else {
            console.log('불러오기 실패')
        }
    }

  return (
    <div className="flex flex-col border-2 items-center gap-y-5">
        <h1 className="my-3 font-bold">
            상품 목록 {category?.name}
        </h1>


        <div className="grid grid-cols-2 w-full gap-4 place-items-center">
            {data.length > 0 && (
                data.map((item) => (
                    <ProductItem 
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        price={item.price}
                        images={item.images}
                    />
                ))

            )}
        </div>
    </div>
  )
}

const ProductItem = ({
    id,
    name,
    price,
    images
}) => {
    const router = useRouter();
    return (
        <div 
            className="flex flex-col w-[300px] h-[400px] items-center justify-center"
            onClick={() => router.push(`/product/detail/${id}`)}
        >
            <Image 
                src={images[0]?.url}
                width={300}
                height={300}
                alt={name}
            />
            <h1 className="my-3 font-bold">상품명: {name}</h1>
            <h1 className="my-3">가격: {price}</h1>
        </div>
    );
}