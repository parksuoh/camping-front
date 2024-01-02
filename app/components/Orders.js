'use client'
import { useEffect, useState } from "react"
import { useCookies } from 'react-cookie';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"

export default function OrderList() {
    const [data, setData] = useState([]);
    const [ cookies, setCookie, removeCookie ] = useCookies(['access_token']);
    const status = {
        "READY": "준비",
        "DELIVERY": "배송",
        "COMPLETE": "완료",
        "CANCELED": "취소"
    }


    useEffect(() => {
        getData();
    }, []);


    const getData = async() => {
        const response = await fetch("/api/order", {
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
            주문 리스트
        </h1>

        {data.length > 0 && (
            data.map((item) => (
                <OrderItem 
                    key={item.orderId}
                    orderId={item.orderId}
                    totalPrice={item.totalPrice}
                    receiveName={item.receiveName}
                    sddress={item.sddress}
                    orderStatus={item.orderStatus}
                    orderItems={item.orderItems}
                    status={status}
                />
            ))

        )}
    </div>
  )
}


const OrderItem = ({
    orderId,
    totalPrice,
    receiveName,
    sddress,
    orderStatus,
    orderItems,
    status
}) => {

    return <><div className="flex my-3 gap-x-5 items-center">
        <div>아이디: {orderId}</div>
        <div>총가격: {totalPrice}</div>
        <div>수취자: {receiveName}</div>
        <div>주소: {sddress}</div>
        <div>상태: {status[orderStatus]}</div>
    </div>
    <Accordion type="single" collapsible className="w-1/2">
        <AccordionItem value="item-1">
        <AccordionTrigger>상품목록보기</AccordionTrigger>
        {orderItems.length > 0 && (
            orderItems.map(item => (
            <AccordionContent key={item.orderItemId}>
                <div className="flex gap-x-1">
                    <h1>상품명: {item.productName}</h1>
                    <h1>상품가격: {item.productPrice}</h1>
                </div>
                <div className="flex gap-x-1">
                    <h1>옵션1이름: {item.productFirstOptionName}</h1>
                    <h1>옵션1가격: {item.productFirstOptionPrice}</h1>
                </div>
                <div className="flex gap-x-1">
                    <h1>옵션2이름: {item.productSecondOptionName}</h1>
                    <h1>옵션2가격: {item.productSecondOptionPrice}</h1>
                </div>
                <div className="flex gap-x-1">
                    <h1>개별가격: {item.unitPrice}</h1>
                    <h1>수량: {item.quantity}</h1>
                    <h1>상품총가격: {item.totalPrice}</h1>
                </div>
            </AccordionContent>
            ))
        )}

        </AccordionItem>
    </Accordion>
    </>
}
