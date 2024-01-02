'use client'

import { useEffect, useState } from "react"
import Image from 'next/image';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useCookies } from 'react-cookie';
import { useRouter } from "next/navigation";

export default function ProductItemDetail({productId, logined}) {
    const router = useRouter();
    const [ cookies, setCookie, removeCookie ] = useCookies(['access_token']);
    const [product, setProduct] = useState({});
    const [firstOptionId, setFirstOptionId] = useState(0) 
    const [secondOptionId, setSecondOptionId] = useState(0) 
    const [secondOptionList, setSecondOptionList] = useState([]) 
    const [addPriceObj, setAddPriceObj] = useState({first: 0, second: 0})
    const [quantity, setQuantity] = useState(1)
    const [buttonLoading, setButtonLoading] =useState(false);

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        if(firstOptionId !== 0){
            const filtered = product.firstOptions.filter(item => item.id === firstOptionId)[0]
            setAddPriceObj({first: filtered.addPrice, second: 0})
            setSecondOptionList(filtered.secondOptions)
        }
    }, [firstOptionId])

    useEffect(() => {
        if(firstOptionId !== 0 && secondOptionId !== 0){
            const filtered = secondOptionList.filter(item => item.id === secondOptionId)[0]
            setAddPriceObj(prev => ({...prev, second: filtered.addPrice}))
        }
    }, [secondOptionId])

    const getData = async() => {
        const response = await fetch(`/api/product/detail/${productId}`, {
            method: "GET",
        });
        if(response.status === 200) {
            const jsonData = await response.json();
            console.log(jsonData)
            setProduct(jsonData)
        }else {
            console.log('불러오기 실패')
        }
    }

    const addCart = async() => {
        if(!product.id) return;
        if(firstOptionId <= 0) return;
        if(secondOptionId <= 0) return;
        if(quantity < 1) return;

        setButtonLoading(true)
        try{
            const response = await fetch("/api/cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer '+cookies.access_token
                },
                body: JSON.stringify({
                    productId: product.id,
                    productFirstOptionId: firstOptionId,
                    productSecondOptionId: secondOptionId,
                    quantity: quantity
                }),
            });
            if(response.status === 201) {
                console.log("성공")
                router.push('/cart/list')
            } else {
                console.log('추가실패')
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
        {product?.name}
        </h1>
        {product.images?.length > 0 && (
            <Image
                src={product?.images[0].url}
                width={400}
                height={400}
                alt={product?.name}
            />
        )}

        <h1>설명: {product?.description}</h1>

        <div>기본가격: {product?.price}</div>

        <h1>옵션1</h1>


        <Select 
            onValueChange={value => {setFirstOptionId(value)}}
            defaultValue={firstOptionId}
        >
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="옵션1" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                <SelectLabel>옵션1</SelectLabel>
                    {product.firstOptions?.map(item => (
                        <SelectItem key={item.id} value={item.id}>{item.name} (+{item.addPrice})</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>


        <h1>옵션2</h1>


        <Select 
            onValueChange={value => setSecondOptionId(value)}
            defaultValue={secondOptionId}
        >
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="옵션2" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                <SelectLabel>옵션2</SelectLabel>
                    {secondOptionList.map(item => (
                        <SelectItem key={item.id} value={item.id}>{item.name} (+{item.addPrice})</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
        <div className="flex gap-x-2 items-center justify-center">
            <Button variant="ghost" onClick={()=>setQuantity(prev => prev - 1 <= 1 ? 1 : prev - 1)}>-</Button>
            <h1>수량: {quantity}</h1>
            <Button variant="ghost" onClick={()=>setQuantity(prev => prev+1)}>+</Button>
        </div>
        

        <h1>합계금액: {((product.price ? product.price : 0 ) + addPriceObj.first + addPriceObj.second) * quantity}원</h1>
    
        {logined && firstOptionId !== 0 && secondOptionId !== 0 && !buttonLoading && (
            <Button onClick={() => addCart()}>
                카트추가
            </Button>
        )}
        {buttonLoading && (            
            <Button disabled>
                처리중입니다...
            </Button>
        )}
    </div>
  )
}

