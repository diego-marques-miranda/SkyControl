export interface IAeronave {
  id: number;
  prefixo: string;
  modelo: string;
  companhia: string;
  status: 'Em Voo' | 'Pousando' | 'No Pátio' | 'Taxiando' | 'Manutenção';
  combustivel: number;
  tempoParaPouso: number;
  passageiros: number;
}

export interface IOperacaoLog {
  id: number;
  texto: string;
  hora: string;
}