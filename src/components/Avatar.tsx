// import * as Avatar from "@radix-ui/react-avatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AvatarData {
    nameUsers: string;
    avatarUser: string;
    size: number;
}

export function AvatarCompenent(props: AvatarData) {
    return (

        <Avatar style={{ width: `${props.size}px`, height: `${props.size}px` }}>
            <AvatarImage src={props.avatarUser} alt={props.nameUsers} style={{ width: `${props.size}px`, height: `${props.size}px` }} />
            <AvatarFallback>{props.nameUsers?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>

    )

}