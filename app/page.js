
import { headers } from 'next/headers'
import { cookies } from 'next/headers'
import Header from "./components/Header"
import Image from 'next/image'


export default function Home() {
  const headersList = headers()
  const headerName = headersList.get('name')
  const headerRole = headersList.get('role') 
  const logined = headersList.get('logined') === "true" ? true : false;
  const cookieStore = cookies()
  const accessToken = cookieStore.get('access_token')?.value





  return (
    <main className="flex flex-col ">
      <Header 
        logined={logined}
        headerRole={headerRole}
        headerName={headerName}
      />



      <div className='w-full mt-10 flex items-center justify-center'>
        <Image
            src={"https://kamprite.com/wp-content/uploads/2018/04/adventure-camping-feet-6757-1-1210x423.jpg"}
            width={1210}
            height={423}
            alt={"campingbackground"}
        />
        
      </div>


    </main>
  )
}

