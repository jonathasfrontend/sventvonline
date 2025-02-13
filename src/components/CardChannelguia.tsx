import { Slider } from "../components/ui/slider";

interface CardChannelsGuiaProps {
  id_canal: string;
  nome: string;
  url_imagem: string;
  programacao_atual: {
    titulo: string;
    inicio: string;
    fim: string;
  };
  programacao_proximas: {
    titulo: string;
    inicio: string;
    fim: string;
  };
}

export function CardChannelGuia(props: CardChannelsGuiaProps) {
  // Função para calcular a porcentagem do progresso do programa atual
  const calculateProgress = (inicio: string, fim: string) => {
    const startTime = new Date(inicio).getTime();
    const endTime = new Date(fim).getTime();
    const currentTime = Date.now();

    if (currentTime >= endTime) return 100; // Programa já terminou
    if (currentTime <= startTime) return 0; // Programa ainda não começou

    // Calcula o progresso atual
    return Math.floor(((currentTime - startTime) / (endTime - startTime)) * 100);
  };

  const progress = calculateProgress(
    props.programacao_atual.inicio,
    props.programacao_atual.fim
  );

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-[#323262] gap-3 text-foreground rounded-md shadow-lg w-full">
      {/* Imagem do canal */}
      <div className="w-full flex items-center mb-4">
        <img
          src={props.url_imagem}
          alt={props.nome}
          className="w-16 h-16 rounded-md"
        />
        <div className="ml-4">
          <h2 className="text-lg font-bold">{props.nome}</h2>
          <p className="text-sm text-foreground">{props.programacao_atual.titulo}</p>
        </div>
      </div>

      {/* Slider de progresso */}
      <div className="w-full">
        <div className="flex justify-between text-xs text-foreground mb-1">
          <span>{new Date(props.programacao_atual.inicio).toLocaleTimeString()}</span>
          <span>{new Date(props.programacao_atual.fim).toLocaleTimeString()}</span>
        </div>
          <Slider defaultValue={[progress]} max={100} step={1} />
        <p className="text-right text-xs text-foreground mt-1">
          {progress}% concluído
        </p>
      </div>

      {/* Próxima programação */}
      <div className="w-full mt-4">
        <p className="text-sm text-foreground">A seguir:</p>
        <p className="text-sm font-medium">{props.programacao_proximas.titulo}</p>
      </div>
    </div>
  );
}
