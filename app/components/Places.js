'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';

export default function Places() {

    const [data, setData] = useState([]);

    useEffect(() => {
        getData();
    }, []);


    const getData = async() => {
        const response = await fetch('/api/place', {
            method: "GET",
        });
        if(response.status === 200) {
            const jsonData = await response.json();
            console.log(jsonData)
            setData(jsonData)
        }else {
            console.log('불러오기 실패')
        }
    }


  return (
    <div className="flex flex-col border-2 items-center gap-y-5">
        <h1 className="my-3 font-bold">
            장소 목록 
        </h1>
        <div className="grid grid-cols-2 w-full gap-4 place-items-center">
            {data.length > 0 && (
                data.map((item) => (
                    <PlaceItme 
                        key={item.placeId}
                        placeId={item.placeId}
                        name={item.name}
                        price={item.price}
                        placeImages={item.placeImages}
                    />
                ))

            )}
        </div>
    </div>
  )
}


const PlaceItme = ({
    placeId,
    name,
    price,
    placeImages
}) => {
    const router = useRouter();
    return (
        <div 
            className="flex flex-col w-[300px] h-[400px] items-center justify-center"
            onClick={() => router.push(`/place/detail/${placeId}`)}
        >

            <Image 
                src={placeImages[0]?.url}
                width={300}
                height={300}
                alt={name}
            />

            <h1 className="my-3 font-bold">상품명: {name}</h1>
            <h1 className="my-3">가격: {price}</h1>
        </div>
    );
}