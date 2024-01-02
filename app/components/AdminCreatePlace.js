'use client'
import { useState } from "react"
import { useCookies } from 'react-cookie';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AdminCreatePlace() {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('') 
    const [ cookies, setCookie, removeCookie ] = useCookies(['access_token']);


    const onSubmit = async() => {
        if(!name) return;
        if(!description) return;
        if(price <= 0) return;
        if(!image) return;

        let formData = new FormData()

        const addPlaceRequestDto = `{"name":"${name}","price": ${price},"description":"${description}"}`

        formData.append("AddPlaceRequestDto", new Blob([addPlaceRequestDto], {type: 'application/json; charset=utf-8'}))
        formData.append("image", image)

        try{
            const response = await fetch("/api/admin/place", {
                method: "POST",
                headers: {
                    "Authorization": 'Bearer '+cookies.access_token
                },
                body: formData
            });
            if(response.status === 201) {
                alert('성공')
                router.push('/admin/place/list')
            } else {
                alert('실패')
            }

        }catch(e){
            console.log(e)
        }

    }


  return (
    <div className="flex flex-col border-2 items-center gap-y-5">
        <h1 className="my-3 font-bold">
            상품 생성
        </h1>
        <Input 
            type="text"
            placeholder='이름을 입력해주세요'
            value={name}
            onChange={e => setName(e.target.value)}
            className="max-w-xs"
        />
        <Input 
            type="number"
            placeholder='가격을 입력해주세요'
            value={price}
            onChange={e => setPrice(e.target.value)}
            className="max-w-xs"
        />
        <Input 
            type="text"
            placeholder='설명을 입력해주세요'
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="max-w-xs"
        />
        
        {typeof(image) === 'string' ? image : image.name}
        <Input 
            type="file" 
            accept=".gif, .jpg, .jpeg, .png"
            onChange={(e) => {
                setImage(e.target.files[0])
            }}
            className="max-w-xs"
        />
        <Button
            onClick={() => onSubmit()}
        >
            생성
        </Button>
    </div>
  )
}

