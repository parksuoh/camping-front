'use client'

import { use, useEffect, useState } from "react"
import { useCookies } from 'react-cookie';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox"

export default function CartList() {
    const router = useRouter();
    const [data, setData] = useState([]);
    const [ cookies, setCookie, removeCookie ] = useCookies(['access_token']);
    const [allChecked, setAllchecked] = useState(false)
    const [checks, setChecks] = useState([])
    const [receiverName, setReceiverName] = useState('');
    const [address, setAddress] = useState('')
    const [buttonLoading, setButtonLoading] =useState(false);

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        if(allChecked) {
            setChecks(data.map(item => item.cartItemId))
        } else{
            setChecks([])
        }

    }, [allChecked])

    const getData = async() => {

        const response = await fetch("/api/cart", {
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

    const onOrder = async() => {
        if (checks.length === 0) return
        if(!address) return;
        if(!receiverName) return;

        setButtonLoading(true)
        try{
            const response = await fetch("/api/order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer '+cookies.access_token
                },
                body: JSON.stringify({
                    receiverName,
                    address,
                    cartItemIds: checks
                }),
            });
            if(response.status === 201) {
                router.push('/order/list')
            } else {
                alert('주문실패')
                setButtonLoading(false)
            }

        }catch(e){
            console.log(e)
            setButtonLoading(false)
        }

    }

    

  return (
    <div className="flex flex-col border-2 items-center">
        <h1 className="my-3 font-bold">
            카트 리스트
        </h1>
        <h1>전체선택: </h1>
        <Checkbox 
            checked={allChecked}
            onCheckedChange={() => setAllchecked(prev => !prev) }
        />

        {data.length > 0 && (
            data.map((item) => (
                <CartItem 
                    key={item.cartItemId}
                    cartItemId={item.cartItemId}
                    quantity={item.quantity}
                    productId={item.productId}
                    name={item.name}
                    price={item.price}
                    productFirstOptionId={item.productFirstOptionId}
                    productFirstOptionName={item.productFirstOptionName}
                    firstAddPrice={item.firstAddPrice}
                    productSecondOptionId={item.productSecondOptionId}
                    productSecondOptionName={item.productSecondOptionName}
                    productSecondPrice={item.productSecondPrice}
                    itemUnitPrice={item.itemUnitPrice}
                    itemTotalPrice={item.itemTotalPrice}
                    getData={getData}
                    checks={checks}
                    setChecks={setChecks}
                />
            ))

        )}

        <Input
            type="text"
            placeholder='수취자를 입력해주세요'
            value={receiverName}
            onChange={e => setReceiverName(e.target.value)}
            className="col-span-3 w-1/2 my-3"
        />
        <Input
            type="text"
            placeholder='주소를 입력해주세요'
            value={address}
            onChange={e => setAddress(e.target.value)}
            className="col-span-3 w-1/2 my-3"
        />

        {!buttonLoading ? (
            <Button onClick={() => onOrder()}>
                카트추가
            </Button>
        ) : (            
            <Button disabled>
                처리중입니다...
            </Button>
        )}
    </div>
  )
}


const CartItem = ({
    cartItemId,
    quantity,
    productId,
    name,
    price,
    productFirstOptionId,
    productFirstOptionName,
    firstAddPrice,
    productSecondOptionId,
    productSecondOptionName,
    productSecondPrice,
    itemUnitPrice,
    itemTotalPrice,
    getData,
    checks,
    setChecks
}) => {
    const router = useRouter();
    const [editQuantity, setEditQuantity] = useState(quantity)
    const [ cookies, setCookie, removeCookie ] = useCookies(['access_token']);

    const updateQuantity = async() => {
        if(editQuantity < 1) return;
        try{
            const response = await fetch("/api/cart", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer '+cookies.access_token
                },
                body: JSON.stringify({
                    cartItemId,
                    quantity: editQuantity 
                })
            });
            if(response.status === 200) {
                alert('수정성공')
                getData()
            } else {
                alert('실패')
            }

        }catch(e){
            console.log(e)
        }
    }

    const onDelete = async() => {
        const response = await fetch(`/api/cart/${cartItemId}`, {
            method: "DELETE",
            headers: {
                "Authorization": 'Bearer '+cookies.access_token
            },
        });
        if(response.status === 200) {
            alert('삭제성공')
            getData()
        }else {
            alert('실패')
        }
    }


    return (
    <>
    <div className="flex my-5 gap-x-5 items-center">
        
        <Checkbox 
            checked={checks.includes(cartItemId)}
            onCheckedChange={() => checks.includes(cartItemId) ? 
                setChecks(prev => prev.filter(item => item !== cartItemId)) :
                setChecks(prev => [...prev, cartItemId])
            }
        />

        <div>상품명: {name}</div>
        <div>상품수량: {quantity}</div>
        <div>상품가격: {price}</div>
        <div>상품+옵션가격: {itemUnitPrice}</div>
        <div>총가격: {itemTotalPrice}</div>
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">수량변경</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>상품수량변경</DialogTitle>
                </DialogHeader>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Button variant="ghost" onClick={()=>setEditQuantity(prev => prev - 1 <= 1 ? 1 : prev - 1)}>-</Button>
                        <h1>수량: {editQuantity}</h1>
                        <Button variant="ghost" onClick={()=>setEditQuantity(prev => prev+1)}>+</Button>
                    </div>
                <DialogFooter>
                    <Button 
                        type="submit" 
                        onClick={() => updateQuantity()}
                    >
                        변경
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        <Button 
            variant="outline"
            onClick={() => onDelete()}
        >
            삭제
        </Button>
    </div>
    <Accordion type="single" collapsible className="w-1/2">
      <AccordionItem value="item-1">
        <AccordionTrigger>옵션보기</AccordionTrigger>
        <AccordionContent>
          옵션1: {productFirstOptionName}(+{firstAddPrice})
        </AccordionContent>
        <AccordionContent>
          옵션2: {productSecondOptionName}(+{productSecondPrice})
        </AccordionContent>
      </AccordionItem>
    </Accordion>
    </>);
}
