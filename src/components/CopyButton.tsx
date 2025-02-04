import { CopySimple } from "@phosphor-icons/react";
import { toast } from "react-toastify";

function CopyIdButton({ id }: { id: string }) {
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(id);
            toast.success("ID copiado para o clipboard!");
        } catch (error) {
            toast.error("Erro ao copiar o ID!");
        }
    };

    return (
        <button
            className="flex w-[120px] items-center justify-center bg-slate-900 p-2 rounded-lg text-xs text-gray-300"
            onClick={copyToClipboard}
        >
            Copiar ID
            <CopySimple className="ml-2 w-5 h-5" />
        </button>
    );
}

export default CopyIdButton;
