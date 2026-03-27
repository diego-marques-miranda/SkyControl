import { useState, useEffect } from 'react';
import type { IAeronave, IOperacaoLog } from './interfaces/IAeronave';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AircraftCard } from './components/AircraftCard';
import './App.css';

const MODELOS = ["Boeing 737", "Airbus A320", "Embraer 195", "Gulfstream G550", "Cessna Citation", "ATR 72"];
const COMPANHIAS = ["TAM", "GOL", "Azul", "TAP", "Lufthansa", "Emirates"];
const PREFIXOS = ["PT", "PR", "PS", "PP"];

const gerarAeronaveAleatoria = (): IAeronave => {
  const id = Math.floor(Math.random() * 100000);
  const prefixo = `${PREFIXOS[Math.floor(Math.random() * PREFIXOS.length)]}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
  
  return {
    id,
    prefixo,
    modelo: MODELOS[Math.floor(Math.random() * MODELOS.length)],
    companhia: COMPANHIAS[Math.floor(Math.random() * COMPANHIAS.length)],
    status: 'Em Voo',
    combustivel: Math.floor(Math.random() * 40) + 40,
    tempoParaPouso: Math.floor(Math.random() * 60) + 30,
    passageiros: Math.floor(Math.random() * 180)
  };
};

function App() {
  const [aeronaves, setAeronaves] = useState<IAeronave[]>([
    { id: 1, prefixo: "PR-VDR", modelo: "Falcon 8X", companhia: "NetJets", status: "Em Voo", combustivel: 75, tempoParaPouso: 12, passageiros: 8 },
    { id: 2, prefixo: "PS-JBS", modelo: "Learjet 75", companhia: "Líder Aviação", status: "Em Voo", combustivel: 20, tempoParaPouso: 35, passageiros: 6 },
    { id: 3, prefixo: "PP-MTR", modelo: "Pilatus PC-24", companhia: "Icon Taxi Aéreo", status: "No Pátio", combustivel: 100, tempoParaPouso: 0, passageiros: 2 },
    { id: 4, prefixo: "PR-WZC", modelo: "Cessna Caravan", companhia: "Azul Conecta", status: "No Pátio", combustivel: 45, tempoParaPouso: 0, passageiros: 0 },
    { id: 5, prefixo: "PT-LJQ", modelo: "Gulfstream G650", companhia: "Air Hamburg", status: "Em Voo", combustivel: 90, tempoParaPouso: 120, passageiros: 14 },
    { id: 6, prefixo: "PS-HBR", modelo: "Phenom 300", companhia: "Helisul", status: "Manutenção", combustivel: 10, tempoParaPouso: 0, passageiros: 0 },
    { id: 7, prefixo: "PT-GOL", modelo: "Boeing 737", companhia: "GOL", status: "Em Voo", combustivel: 60, tempoParaPouso: 45, passageiros: 160 },
    { id: 8, prefixo: "PR-TAM", modelo: "Airbus A320", companhia: "LATAM", status: "Em Voo", combustivel: 55, tempoParaPouso: 80, passageiros: 174 },
  ]);

  const [logs, setLogs] = useState<IOperacaoLog[]>([]);

  useEffect(() => {
    const monitor = setInterval(() => {
      setAeronaves(prev => prev.map(aero => {
        const consumo = (aero.status === 'Em Voo' || aero.status === 'Taxiando') ? 0.15 : 0;
        
        if (aero.status === 'Em Voo' && aero.tempoParaPouso > 0) {
          return { ...aero, tempoParaPouso: aero.tempoParaPouso - 1, combustivel: Math.max(0, aero.combustivel - consumo) };
        }
        if (aero.status === 'Em Voo' && aero.tempoParaPouso === 0) {
          return { ...aero, status: 'Pousando' };
        }
        return { ...aero, combustivel: Math.max(0, aero.combustivel - consumo) };
      }));
    }, 1000);
    return () => clearInterval(monitor);
  }, []);

  useEffect(() => {
    const gerador = setInterval(() => {
      const novaAeronave = gerarAeronaveAleatoria();
      setAeronaves(prev => [...prev, novaAeronave]);
      registrarAcao(`RADAR: ${novaAeronave.prefixo} interceptado no setor de aproximação.`);
    }, 30000);

    return () => clearInterval(gerador);
  }, []);

  const registrarAcao = (msg: string) => {
    const novoLog: IOperacaoLog = { id: Date.now(), texto: msg, hora: new Date().toLocaleTimeString() };
    setLogs(prev => [novoLog, ...prev.slice(0, 5)]);
  };

  const autorizarPouso = (id: number, pref: string) => {
    setAeronaves(prev => prev.map(a => a.id === id ? { ...a, status: 'No Pátio', tempoParaPouso: 0 } : a));
    registrarAcao(`POUSO: ${pref} taxiando para o pátio.`);
  };

  const iniciarDecolagem = (id: number, pref: string) => {
    setAeronaves(prev => prev.map(a => a.id === id ? { ...a, status: 'Taxiando' } : a));
    registrarAcao(`SOLO: ${pref} autorizado taxi.`);
    setTimeout(() => {
      setAeronaves(prev => prev.map(a => a.id === id ? { ...a, status: 'Em Voo', tempoParaPouso: 150, combustivel: 100 } : a));
      registrarAcao(`TORRE: ${pref} decolagem confirmada.`);
    }, 5000);
  };

  return (
    <div className="app-container">
      <Header />

      <main className="main-content container-fluid px-4 mt-4">
        <div className="row g-4">
          <aside className="col-12 col-lg-3">
            <Sidebar 
              emVoo={aeronaves.filter(a => a.status === 'Em Voo' || a.status === 'Pousando').length} 
              emSolo={aeronaves.filter(a => a.status === 'No Pátio' || a.status === 'Taxiando').length} 
            />

            <div className="card bg-radar p-3 shadow-sm">
              <h3 className="h6 fw-bold text-uppercase border-bottom border-success mb-2 pb-1">Radio Comm</h3>
              {logs.map(log => (
                <div key={log.id} style={{ fontSize: '0.7rem' }} className="mb-1 text-uppercase">
                  <span className="opacity-50">[{log.hora}]</span> {log.texto}
                </div>
              ))}
            </div>
          </aside>

          <section className="col-12 col-lg-9">
            <div className="row g-2">
              {aeronaves.map(aero => (
                <AircraftCard 
                  key={aero.id} 
                  aero={aero} 
                  onPouso={autorizarPouso} 
                  onDecolagem={iniciarDecolagem} 
                />
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-dark text-light py-3">
        <div className="container text-center">
          <address className="mb-0 small">
            <span className="text-warning fw-bold">SKY CONTROL HUB</span> | 
            <strong> Diego Marques Miranda</strong> | 
            <strong> 13/04/26</strong> | 
            <span> Desenvolvimento de Software Web</span> | 
            <strong> Prof. Alexandre Almeida</strong>
          </address>
        </div>
      </footer>
    </div>
  );
}

export default App;