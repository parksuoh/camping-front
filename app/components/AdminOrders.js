'use client'
import { useEffect, useState } from "react"
import { useCookies } from 'react-cookie';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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


export default function AdminOrderList() {
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
  
        const response = await fetch("/api/admin/order", {
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
                    address={item.sddress}
                    orderStatus={item.orderStatus}
                    orderItems={item.orderItems}
                    status={status}
                    getData={getData}
                    cookies={cookies}
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
    address,
    orderStatus,
    orderItems,
    status,
    getData,
    cookies
  }) => {
    const [newOrderStatus, setNewOrderStatus] = useState(orderStatus)


    const changeStatus = async() => {
        try{
            const response = await fetch("/api/admin/order", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer '+cookies.access_token
                },
                body: JSON.stringify({
                    orderId,
                    orderStatus: newOrderStatus
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


    return (
      <>
      <div 
          className="flex my-3 gap-x-5 items-center"
      >
            <div>아이디: {orderId}</div>
            <div>총가격: {totalPrice}</div>
            <div>수취자: {receiveName}</div>
            <div>주소: {address}</div>
            <div>상태: {status[orderStatus]}</div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">상태변경</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                    <DialogTitle>주문상태 변경</DialogTitle>
                    </DialogHeader>

                    <Select onValueChange={value => setNewOrderStatus(value)} defaultValue={orderStatus}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="상태변경" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="READY">{status["READY"]}</SelectItem>
                                <SelectItem value="DELIVERY">{status["DELIVERY"]}</SelectItem>
                                <SelectItem value="COMPLETE">{status["COMPLETE"]}</SelectItem>
                                <SelectItem value="CANCELED">{status["CANCELED"]}</SelectItem>
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
    );
  }