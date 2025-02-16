import logoSolo from '@/img/white_logo_solo_vazado.png';

export default function Loading() {
    return (
        <div className="absolute top-0 left-0 z-50 w-full h-screen bg-background flex items-center justify-center">
            <img src={logoSolo} className="w-12 animate-bounce " alt="" />
        </div>
    );
}