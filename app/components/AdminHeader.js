'use client'
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";


export default function AdminHeader() {
    const router = useRouter();

  return (
    <div className="border-b-2 border-gray-950 flex justify-between items-center px-10 py-10">
        <h1 className="text-lg font-bold">
            관리자
        </h1>
        <div className="flex gap-x-1">
            <Button 
                variant="secondary"
                onClick={() => router.push('/admin/category/list')}
            >
                카테고리
            </Button>
            <Button 
                variant="secondary"
                onClick={() => router.push('/admin/product/list')}
            >
                상품
            </Button>
            <Button 
                variant="secondary"
                onClick={() => router.push('/admin/order/list')}
            >
                주문
            </Button>
            <Button 
                variant="secondary"
                onClick={() => router.push('/admin/place/list')}
            >
                장소
            </Button>
            <Button 
                variant="secondary"
                onClick={() => router.push('/admin/place/reservation')}
            >
                예약
            </Button>
            <Button 
                variant="secondary"
                onClick={() => router.push('/')}
            >
                홈으로 가기
            </Button>
        </div>
        
    </div>
  )
}

