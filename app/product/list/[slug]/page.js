
import Products from "@/app/components/Products";
import { headers } from 'next/headers'


export default function ProductList({params}){
    const headersList = headers()
    const logined = headersList.get('logined') === "true" ? true : false;

    return <div>
        <Products categoryId={params.slug} />
    </div>;
}