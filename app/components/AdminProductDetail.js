'use client'
import { useEffect, useState } from "react"
import { useCookies } from 'react-cookie';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  import Image from 'next/image';


export default function AdminProductDetail({productId}) {
    const [product, setProduct] = useState({});
    const [categorys, setCategorys] = useState([]);
    const [image, setImage] = useState('') 
    const [ cookies, setCookie, removeCookie ] = useCookies(['access_token']);

    const [firstOptionName, setFirstOptionName] = useState('') 
    const [firstOptionPrice, setFirstOptionPrice] = useState(0) 

    const [secondOptionName, setSecondOptionName] = useState('') 
    const [secondOptionPrice, setSecondOptionPrice] = useState(0) 

    useEffect(() => {
        getData();
        getCategory();
    }, []);


    const getData = async() => {

        const response = await fetch(`/api/admin/product/detail/${productId}`, {
            method: "GET",
            headers: {
                "Authorization": 'Bearer '+cookies.access_token
            },
        });
        if(response.status === 200) {
            const jsonData = await response.json();
            console.log(jsonData)
            setProduct(jsonData)
        }else {
            console.log('불러오기 실패')
        }
    }
    const getCategory = async() => {

        const response = await fetch("/api/admin/category", {
            method: "GET",
            headers: {
                "Authorization": 'Bearer '+cookies.access_token
            },
        });
        if(response.status === 200) {
            const jsonData = await response.json();
            setCategorys(jsonData)
        }else {
            console.log('불러오기 실패')
        }
    }


    const updateDetail = async() => {
        if(!product.name) return;
        if(!product.description) return;
        if(product.price <= 0) return;
        if(product.categoryId === 0) return;

        try{
            const response = await fetch("/api/admin/product", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer '+cookies.access_token
                },
                body: JSON.stringify({
                    productId: product.id,
                    categoryId: product.categoryId,
                    name: product.name,
                    price: product.price,
                    description: product.description
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

    const updateImage = async() => {
        if(!image) return;
        let formData = new FormData()
        const updateProductImageResponseDto = `{"productId":${product.id},"productImageId":${product.images[0].id}}`

        formData.append("UpdateProductImageResponseDto", new Blob([updateProductImageResponseDto], {type: 'application/json; charset=utf-8'}))
        formData.append("image", image)

        try{
            const response = await fetch("/api/admin/product/product-image", {
                method: "PATCH",
                headers: {
                    "Authorization": 'Bearer '+cookies.access_token
                },
                body: formData
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

    const deleteFirstOption = async(productFirstOptionId) => {
        const response = await fetch(`/api/admin/product/first-option/${productFirstOptionId}`, {
            method: "DELETE",
            headers: {
                "Authorization": 'Bearer '+cookies.access_token
            },
        });
        if(response.status === 200) {
            alert('삭제성공')
            getData();
        }else {
            alert('실패')
        }
    }

    const deleteSecondOption = async(productSecondOptionId) => {
        const response = await fetch(`/api/admin/product/second-option/${productSecondOptionId}`, {
            method: "DELETE",
            headers: {
                "Authorization": 'Bearer '+cookies.access_token
            },
        });
        if(response.status === 200) {
            alert('삭제성공')
            getData();
        }else {
            alert('실패')
        }

    }

    const onCreateFirstOption = async() => {
        if(!firstOptionName) return;


        try{
            const response = await fetch("/api/admin/product/first-option", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer '+cookies.access_token
                },
                body: JSON.stringify({
                    productId: product.id,
                    name: firstOptionName ,
                    price: firstOptionPrice
                }),
            });
            if(response.status === 201) {
                alert("추가성공")
                setFirstOptionName('');
                setFirstOptionPrice(0);
                getData();
            } else {
                console.log('추가실패')
            }

        }catch(e){
            console.log(e)
        }
    }

    const onCreateSecondOption = async(productFirstOptionId) => {
        if(!secondOptionName) return;

        try{
            const response = await fetch("/api/admin/product/second-option", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer '+cookies.access_token
                },
                body: JSON.stringify({
                    productFirstOptionId,
                    name: secondOptionName ,
                    price: secondOptionPrice
                }),
            });
            if(response.status === 201) {
                alert("추가성공")
                setSecondOptionName('');
                setSecondOptionPrice(0);
                getData();
            } else {
                console.log('추가실패')
            }

        }catch(e){
            console.log(e)
        }
    }

  return (
    <div className="flex flex-col border-2 items-center gap-y-5">
        <h1 className="my-3 font-bold">
            상품 상세
        </h1>
        {categorys.length > 0 && (
            <Select onValueChange={value => setProduct((prev) => ({...prev, categoryId: value}))} defaultValue={product?.categoryId}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {categorys.map(item => (
                            <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        )}
        <Input 
            type="text"
            placeholder='이름을 입력해주세요'
            value={product?.name}
            onChange={e => setProduct(prev => ({...prev, name: e.target.value}))}
            className="max-w-xs"
        />
        <Input 
            type="number"
            placeholder='가격을 입력해주세요'
            value={product?.price}
            onChange={e => setProduct(prev => ({...prev, price: e.target.value}))}
            className="max-w-xs"
        />
        <Input 
            type="text"
            placeholder='설명을 입력해주세요'
            value={product?.description}
            onChange={e => setProduct(prev => ({...prev, description: e.target.value}))}
            className="max-w-xs"
        />
        <Button
          onClick={() => updateDetail()}
        >
            수정
        </Button>


        {product.images?.length > 0 && (
                <Image
                    src={product.images[0].url}
                    width={300}
                    height={300}
                    alt={product?.name}
                />
        )}

      <Input 
          type="file" 
          accept=".gif, .jpg, .jpeg, .png"
          onChange={(e) => {
              setImage(e.target.files[0])
          }}
          className="max-w-xs"
      />

        <Button
          onClick={() => updateImage()}
        >
        이미지 수정
        </Button>

        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">옵션1 추가</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>New 옵션1</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Input
                            type="text"
                            placeholder='옵션이름을 입력해주세요'
                            value={firstOptionName}
                            onChange={e => setFirstOptionName(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Input
                            type="number"
                            placeholder='추가가격을 입력해주세요'
                            value={firstOptionPrice}
                            onChange={e => setFirstOptionPrice(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    </div>
                <DialogFooter>
                    <Button 
                        type="submit" 
                        onClick={() => onCreateFirstOption()}
                    >
                        추가
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {product.firstOptions?.length > 0 && (
        <div>
            {product.firstOptions.map(firstOption => (
                <div 
                    key={firstOption.id}
                    className="flex flex-col border rounded-lg my-3.5 p-1  gap-y-5"
                >
                    <div className="flex gap-x-5 text-lg font-bold justify-center items-center ">
                        <h1>옵션1 이름: {firstOption.name}</h1>
                        <h1>옵션1 가격: {firstOption.addPrice}</h1>
                        <Button 
                            variant="outline"
                            onClick={() => deleteFirstOption(firstOption.id)}
                        >
                            옵션1 삭제
                        </Button>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline">옵션2 추가</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                <DialogTitle>{firstOption.name}의 옵션2 추가</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Input
                                            type="text"
                                            placeholder='옵션이름을 입력해주세요'
                                            value={secondOptionName}
                                            onChange={e => setSecondOptionName(e.target.value)}
                                            className="col-span-3"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Input
                                            type="number"
                                            placeholder='추가가격을 입력해주세요'
                                            value={secondOptionPrice}
                                            onChange={e => setSecondOptionPrice(e.target.value)}
                                            className="col-span-3"
                                        />
                                    </div>
                                    </div>
                                <DialogFooter>
                                    <Button 
                                        type="submit" 
                                        onClick={() => onCreateSecondOption(firstOption.id)}
                                    >
                                        추가
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                    </div>

                    <div>
                        {firstOption.secondOptions?.length > 0 && (
                            firstOption.secondOptions.map(secondOption => (
                                <div 
                                    key={secondOption.id}
                                    className="flex gap-x-5 text-lg font-bold justify-center items-center "
                                >
                                    <h2>↘︎↘︎↘︎</h2>
                                    <div>옵션2 이름: {secondOption.name}</div>
                                    <div>옵션2 가격: {secondOption.addPrice}</div>
                                    <Button 
                                        variant="outline"
                                        onClick={() => deleteSecondOption(secondOption.id)}
                                    >
                                        옵션2 삭제
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                    

                </div>
                
                
            ))}
        </div>)}



    </div>
  )
}
