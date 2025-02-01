import { NextResponse, type MiddlewareConfig, type NextRequest } from "next/server"

const publicRoutes = [
    { path: '/login', whenAuthenticated: 'redirect' },
    { path: '/signup', whenAuthenticated: 'redirect' },
    { path: '/pricing', whenAuthenticated: 'next' },
]

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = '/sign-in'

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    const publicRoute = publicRoutes.find(route => route.path === path)
    const authToken = request.cookies.get('token')

    if (!authToken && publicRoute) { // Se o usuario nao esta autenticado e a rota e publica
        return NextResponse.next() // Continuar a execucao
    }

    if (!authToken && !publicRoute) { // Se o usuario nao esta autenticado e a rota nao e publica
        const redirectUrl = request.nextUrl.clone() // Clonar a URL atual

        redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE // Alterar o pathname para a rota de redirecionamento

        return NextResponse.redirect(redirectUrl) // Redirecionar o usuario para a rota de redirecionamento (sign-in)
    }

    if (authToken && publicRoute && publicRoute.whenAuthenticated === 'redirect') { // Se o usuario esta autenticado e a rota e publica
        const redirectUrl = request.nextUrl.clone() // Clonar a URL atual

        redirectUrl.pathname = '/' // Alterar o pathname para a rota inicial

        return NextResponse.redirect(redirectUrl) // Redirecionar o usuario para a rota inicial
    }

    if (authToken && !publicRoute) { // Se o usuario esta autenticado e a rota nao e publica
        // Checar se o JWT esta EXPIRADO
        // Se sim, remover o cookie e redirecionar o usuario pro login
        // Aplicar uma estratégia de refresh

        return NextResponse.next()
    }

    return NextResponse.next()
}

export const config: MiddlewareConfig = {
    matcher: [
        /*
        * Match all request paths except for the ones starting with:
        * - api (API routes)
        * - _next/static (static files)
        * - _next/image (image optimization files)
        * - favicon.ico, sitemap.xml, robots.txt (metadata files)
        */
        '/(( ?! apil_next/staticl_next/image|favicon.ico|sitemap.xml|robots.txt).#)',
    ],
}