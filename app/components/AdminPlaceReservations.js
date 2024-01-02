'use client'
import { useEffect, useState } from "react"
import { useCookies } from 'react-cookie';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function AdminPlaceReservations() {
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

        const response = await fetch("/api/admin/place/reservation", {
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
                    placePrice={item.placePrice}
                    reservationDate={item.reservationDate}
                    reservationStatus={item.reservationStatus}
                    status={status}
                    getData={getData}
                    cookies={cookies}
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
    status,
    getData,
    cookies
}) => {
    const [reservation, setReservation] = useState(reservationStatus)


    const changeStatus = async() => {
        try{
            const response = await fetch("/api/admin/place/reservation", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer '+cookies.access_token
                },
                body: JSON.stringify({
                    placeReservationId,
                    reservcationStatus: reservation
                }),
            });
            if(response.status === 200) {
                alert('수정성공')
                getData();
            } else {
                alert('실패')
            }

        }catch(e){
            console.log(e)
        }
    }


    return <div 
            className="flex my-3 gap-x-5 items-center"
        >
            <div>아이디: {placeReservationId}</div>
            <div>장소이름: {placeName}</div>
            <div>가격: {placePrice}</div>
            <div>날짜: {reservationDate}</div>
            <div>상태: {status[reservationStatus]}</div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">상태변경</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                    <DialogTitle>예약상태 변경</DialogTitle>
                    </DialogHeader>

                    <Select onValueChange={value => setReservation(value)} defaultValue={reservationStatus}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="상태변경" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="REQUEST">{status["REQUEST"]}</SelectItem>
                                <SelectItem value="CONFIRM">{status["CONFIRM"]}</SelectItem>
                                <SelectItem value="RESERVATION_CANCELED">{status["RESERVATION_CANCELED"]}</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <DialogFooter>
                        <Button 
                            type="submit" 
                            onClick={() => changeStatus()}
                        >
                            변경
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
    </div>;
}