import Header from "../components/Header";
import { headers } from 'next/headers'
import "../globals.css";

export default function productRayout({ children }) {
    const headersList = headers()
    const headerName = headersList.get('name')
    const headerRole = headersList.get('role') 
    const logined = headersList.get('logined') === "true" ? true : false;


    return <>
        <Header
            logined={logined}
            headerRole={headerRole}
            headerName={headerName}
        />
        <div>{children}</div>
    </>;
}