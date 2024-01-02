
import Header from "../components/Header";
import "../globals.css";
import { headers } from 'next/headers'

export default function cartRayout({ children }) {
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