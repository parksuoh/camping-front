import AdminHeader from "../components/AdminHeader";
import "../globals.css";

export default function adminRayout({ children }) {

    return <>
        <AdminHeader />
        <div>{children}</div>
    </>;
}