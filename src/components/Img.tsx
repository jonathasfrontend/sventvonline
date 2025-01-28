import { ImgHTMLAttributes } from 'react';

interface ImgProps extends ImgHTMLAttributes<HTMLImageElement>{

}

export function Img(props: ImgProps){
    return(
        <img {...props}/>
    )
}