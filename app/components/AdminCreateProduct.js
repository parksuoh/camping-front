'use client'
import { useState, useEffect } from "react"
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


export default function AdminCreateProduct() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(0);
  const [image, setImage] = useState('') 
  const [categorys, setCategorys] = useState([]);
  const [ cookies, setCookie, removeCookie ] = useCookies(['access_token']);

  useEffect(() => {
      getData();
  }, []);


  const getData = async() => {

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


  const onSubmit = async() => {
    if(!name) return;
    if(!description) return;
    if(price <= 0) return;
    if(categoryId === 0) return;
    if(!image) return;

    let formData = new FormData()

    const addProductRequestDto = `{"categoryId":${categoryId},"name":"${name}","price": ${price},"description":"${description}"}`

    formData.append("AddProductRequestDto", new Blob([addProductRequestDto], {type: 'application/json; charset=utf-8'}))
    formData.append("image", image)

    try{
        const response = await fetch("/api/admin/product", {
            method: "POST",
            headers: {
                "Authorization": 'Bearer '+cookies.access_token
            },
            body: formData
        });
        if(response.status === 201) {
            alert('성공')
            router.push('/admin/product/list')
        } else {
            console.log('실패')
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
        {categorys.length > 0 && (
            <Select onValueChange={value => setCategoryId(value)} defaultValue={0}>
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
