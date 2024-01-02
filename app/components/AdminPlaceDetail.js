'use client'
import { useEffect, useState } from "react"
import { useCookies } from 'react-cookie';
import Image from 'next/image';

export default function AdminPlaceDetail({placeId}) {

    const [place, setPlace] = useState({});
    const [ cookies, setCookie, removeCookie ] = useCookies(['access_token']);

    useEffect(() => {
        getData();
    }, []);


    const getData = async() => {

        const response = await fetch(`/api/admin/place/detail/${placeId}`, {
            method: "GET",
            headers: {
                "Authorization": 'Bearer '+cookies.access_token
            },
        });
        if(response.status === 200) {
            const jsonData = await response.json();
            setPlace(jsonData)
        }else {
            console.log('불러오기 실패')
        }
    }

  return (
    <div className="flex flex-col border-2 items-center gap-y-5">
        <h1 className="my-3 font-bold">
            장소 상세
        </h1>
        <h1>아이디: {place?.placeId && place.placeId}</h1>
        <h1>이름: {place?.name && place.name}</h1>
        <h1>가격: {place?.price && place.price}</h1>
        <h1>설명: {place?.description && place.description}</h1>
        <div>
            {place?.placeImages?.length > 0 && (
                            <Image
                                src={place.placeImages[0].url}
                                width={300}
                                height={300}
                                alt={place?.name}
                            />
            )}
        </div>
    </div>
  )
}

