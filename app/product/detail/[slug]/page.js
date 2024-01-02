
import ProductItemDetail from "@/app/components/ProductItemDetail";
import { headers } from "next/headers";

export default function ProductDetail({params}){
    const headersList = headers()
    const logined = headersList.get('logined') === "true" ? true : false;


    return <div>
        <ProductItemDetail 
            productId={params.slug} 
            logined={logined}
        />
    </div>;
}