interface SidebarProps {
  emVoo: number;
  emSolo: number;
}

export const Sidebar = ({ emVoo, emSolo }: SidebarProps) => (
  <div className="card shadow-sm border-0 mb-3 bg-white text-dark">
    <div className="card-body">
      <h2 className="h6 fw-bold border-bottom pb-2 mb-3 text-uppercase">Status do Radar</h2>
      <p className="small mb-2 d-flex justify-content-between">
        Aeronaves em Voo: <strong>{emVoo}</strong>
      </p>
      <p className="small mb-0 d-flex justify-content-between">
        Aeronaves em Solo: <strong>{emSolo}</strong>
      </p>
    </div>
  </div>
);