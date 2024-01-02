'use client'
import { useEffect, useState } from "react"
import { useCookies } from 'react-cookie';

export default function PlaceReservationList() {
    const [data, setData] = useState([]);
    const [ cookies, setCookie, removeCookie ] = useCookies(['access_token']);

    const status = {
        "REQUEST": "요청",
        "CONFIRM": "확정",
        "RESERVATION_CANCELED": "취소"
    }

    useEffect(() => {
        getData();
    }, []);


    const getData = async() => {
        const response = await fetch("/api/place/reservations", {
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



  return (
    <div className="flex flex-col border-2 items-center">
        <h1 className="my-3 font-bold">
            예약 리스트
        </h1>
        {data.length > 0 && (
            data.map((item) => (
                <ReservationItem 
                    key={item.placeReservationId}
                    placeReservationId={item.placeReservationId}
                    placeId={item.placeId}
                    placeName={item.placeName}
                    reservationDate={item.reservationDate}
                    reservationStatus={item.reservationStatus}
                    status={status}
                />
            ))

        )}
    </div>
  )
}

const ReservationItem = ({
    placeReservationId,
    placeId,
    placeName,
    placePrice,
    reservationDate,
    reservationStatus,
    status
}) => {


    return (
        <div className="flex my-3 gap-x-5 items-center">
            <div>아이디: {placeReservationId}</div>
            <div>장소이름: {placeName}</div>
            <div>가격: {placePrice}</div>
            <div>날짜: {reservationDate}</div>
            <div>상태: {status[reservationStatus]}</div>
        </div>
    );
}
