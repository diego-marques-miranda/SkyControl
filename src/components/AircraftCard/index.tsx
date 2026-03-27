import type { IAeronave } from '../../interfaces/IAeronave';

interface Props {
  aero: IAeronave;
  onPouso: (id: number, pref: string) => void;
  onDecolagem: (id: number, pref: string) => void;
}

export const AircraftCard = ({ aero, onPouso, onDecolagem }: Props) => {
  return (
    <article className="col-12">
      <div className={`card card-sky shadow-sm p-2 ${aero.status === 'Pousando' ? 'border-danger' : ''}`}>
        <div className="row align-items-center g-2 text-dark">
          <div className="col-md-2">
            <h4 className="h6 mb-0 fw-bold">{aero.prefixo}</h4>
            <small className="text-muted small">{aero.modelo}</small>
          </div>
          <div className="col-md-2 text-center">
            <span className="badge bg-light text-dark border w-100" style={{ fontSize: '0.7rem' }}>{aero.companhia}</span>
          </div>
          <div className="col-md-2">
            <div className="progress" style={{ height: '6px' }}>
              <div className={`progress-bar ${aero.combustivel < 30 ? 'bg-danger' : 'bg-success'}`} style={{ width: `${aero.combustivel}%` }}></div>
            </div>
            <div className="text-center" style={{ fontSize: '0.6rem' }}>FUEL: {Math.round(aero.combustivel)}%</div>
          </div>
          <div className="col-md-3 text-center">
            {aero.status === 'Em Voo' ? (
              <span className="badge bg-primary">ETA: {aero.tempoParaPouso}s</span>
            ) : (
              <span className={`badge ${aero.status === 'Pousando' ? 'bg-danger badge-critico' : 'bg-success'}`}>
                {aero.status.toUpperCase()}
              </span>
            )}
          </div>
          <div className="col-md-3 text-end">
            {aero.status === 'Pousando' && (
              <button onClick={() => onPouso(aero.id, aero.prefixo)} className="btn btn-sm btn-danger w-100 fw-bold shadow-sm">AUTORIZAR POUSO</button>
            )}
            {aero.status === 'No Pátio' && (
              <button onClick={() => onDecolagem(aero.id, aero.prefixo)} className="btn btn-sm btn-primary w-100 fw-bold shadow-sm">DECOLAR</button>
            )}
            {aero.status === 'Taxiando' && (
              <button disabled className="btn btn-sm btn-secondary w-100">AGUARDANDO PISTA...</button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};