import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware (request: NextRequest) {
  const path = request.nextUrl.pathname
  const hasUserData =
    request.cookies.has('access_token') || request.cookies.has('userData')
  const hasSignedUp = request.cookies.has('hasSignedUp')

  //   If user is not on an auth route and has no userData
  if (path.split('/')[1] !== 'auth' && !hasUserData) {
    // If user has never signed up, redirect to sign-up
    if (!hasSignedUp) {
      return NextResponse.redirect(new URL('/auth/sign-up', request.url))
    }
    // If user has signed up before, redirect to login
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // If user is on an auth route and has userData, redirect to dashboard
  if (path.split('/')[1] === 'auth' && hasUserData) {
    return NextResponse.redirect(new URL(`/tickets`, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
// import type { NextRequest } from 'next/server'
// import { NextResponse } from 'next/server'

// export function middleware (request: NextRequest) {
//   const path = request.nextUrl.pathname
//   const hasUserData = request.cookies.has('userData')
//   const hasSignedUp = request.cookies.has('hasSignedUp')

//   //   If user is not on an auth route and has no userData
//   if (path.split('/')[1] !== 'auth' && !hasUserData) {
//     // If user has never signed up, redirect to sign-up
//     if (!hasSignedUp) {
//       return NextResponse.redirect(new URL('/auth/sign-up', request.url))
//     }
//     // If user has signed up before, redirect to login
//     return NextResponse.redirect(new URL('/auth/login', request.url))
//   }

//   // If user is on an auth route and has userData, redirect to dashboard
//   if (path.split('/')[1] === 'auth' && hasUserData) {
//     return NextResponse.redirect(new URL(`/`, request.url))
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
// }
