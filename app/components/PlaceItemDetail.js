'use client'

import { useEffect, useState } from "react";
import Image from 'next/image';
import { Button } from "@/components/ui/button"
import { useCookies } from 'react-cookie';
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function PlaceItemDetail({placeId, today}) {
    const router = useRouter();
    const [ cookies, setCookie, removeCookie ] = useCookies(['access_token']);
    const [place, setPlace] = useState({});
    const [date, setDate] = useState(today);
    const [buttonLoading, setButtonLoading] =useState(false);

    useEffect(() => {
        getData();
    }, []);


    const getData = async() => {
        const response = await fetch(`/api/place/detail/${placeId}`, {
            method: "GET",
        });
        if(response.status === 200) {
            const jsonData = await response.json();
            setPlace(jsonData)
        }else {
            console.log('불러오기 실패')
        }
    }

    const onReservation = async() => {
        if(!date) return
        if(!place.placeId) return


        setButtonLoading(true)
        try{
            const response = await fetch("/api/place", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer '+cookies.access_token
                },
                body: JSON.stringify({
                    placeId: place.placeId,
                    reservationDate: date
                }),
            });
            if(response.status === 201) {
                router.push('/place/reservation')
            } else {
                alert('예약실패')
                setButtonLoading(false)
            }

        }catch(e){
            console.log(e)
            setButtonLoading(false)
        }

    }

  return (
    <div className="flex flex-col border-2 items-center gap-y-5">
        <h1 className="my-3 font-bold">
        {place?.name}
        </h1>
        {place.placeImages?.length > 0 &&
            <Image
                src={place?.placeImages[0].url}
                width={400}
                height={400}
                alt={place?.name}
            />
        }

        <h1>설명: {place?.description}</h1>

        <div>가격: {place?.price}</div>

        <h1>날짜 선택</h1>
        <Popover>
            <PopoverTrigger asChild>
                <Button
                variant={"outline"}
                className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                )}
                >
                <span>{date}</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={day => {
                        let year = day.getFullYear()
                        let month = day.getMonth()+1
                        let date = day.getDate()
                        let selectedDate = year + '-' + month + '-' + date
                        
                        const date1 = new Date(today);
                        const date2 = new Date(selectedDate);

                        date1 < date2 ? setDate(selectedDate) : alert('오늘 이전 날짜는 선택하실수 없습니다.')
                    }}
                    initialFocus
                />
            </PopoverContent>
        </Popover>

        {!buttonLoading ? (
            <Button onClick={() => onReservation()}>
                예약하기
            </Button>
        ) : (            
            <Button disabled>
                처리중입니다...
            </Button>
        )}
    </div>
  )
}
