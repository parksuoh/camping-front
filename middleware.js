import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import mainPath from './app/utils/path';

const onAuth = async(token) => {
    const response = await fetch(mainPath+"/api/user/auth", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            token
        }),
    });

    if(response.status === 200) {
        const jsonData = await response.json();

        console.log('인증 성공')
        return {
            name: jsonData.name,
            role: jsonData.role,
            newAccessToken: jsonData.accessToken 
        };

    } else {
        console.log('인증 실패')
        return null
    }


}


export async function middleware(request) {
    let roleAdmin = false;
    let logined = false;
    const accessTokenCookie = request.cookies.get('access_token')?.value;
    const response = NextResponse.next()

    if (accessTokenCookie){
        const authRes = await onAuth(accessTokenCookie);

        if(!authRes) {
            response.cookies.delete('access_token')
        } else {
            response.cookies.set('access_token', authRes.newAccessToken);
            response.headers.set("name", authRes.name)
            response.headers.set("role", authRes.role)
            roleAdmin = authRes.role === "ROLE_ADMIN"
            logined = true; 
        }

    }
    response.headers.set("logined", logined)

    if (request.nextUrl.pathname.startsWith('/admin')) {
        if(!roleAdmin) {
            return NextResponse.redirect(new URL('/', request.nextUrl.origin));
        }
    }

    

    return response;

} 

export const config = {
    matcher: [
        '/', 
        '/cart/:path*', 
        '/order/:path*', 
        '/place/reservation', 
        '/place/list', 
        '/place/detail/:path*', 
        '/admin/:path*',
        '/user/:path*',
        '/product/detail/:path*',
        '/product/list/:path*'
    ],
  }