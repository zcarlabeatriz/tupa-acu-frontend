import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import './OrganogramaTree.css';

const OrganogramaNode = ({ node }) => (
  <div className="organograma-node">
    <Card className="setor-card">
      <Card.Body className="p-3">
        <div className="d-flex align-items-center mb-2">
          <Badge bg="primary" className="me-2 font-monospace">{node.sigla}</Badge>
          <Badge bg={node.status === 'ativo' ? 'success' : 'secondary'} className="ms-auto">
            {node.status}
          </Badge>
        </div>
        <h6 className="setor-nome mb-2">{node.nome}</h6>
        <div className="setor-info">
          <small className="text-muted d-block">
            <i className="fas fa-user me-1"></i>
            {node.responsavel}
          </small>
          <small className="text-muted d-block">
            <i className="fas fa-users me-1"></i>
            {node.totalServidores} servidor{node.totalServidores !== 1 ? 'es' : ''}
          </small>
        </div>
      </Card.Body>
    </Card>
    
    {node.children && node.children.length > 0 && (
      <div className="organograma-children">
        {node.children.map(child => (
          <OrganogramaNode key={child.id} node={child} />
        ))}
      </div>
    )}
  </div>
);

const OrganogramaTree = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="fas fa-sitemap fa-3x text-muted mb-3"></i>
        <p className="text-muted">Nenhum setor encontrado para exibir o organograma</p>
      </div>
    );
  }

  return (
    <div className="organograma-tree">
      <div className="organograma-root">
        {data.map(node => (
          <OrganogramaNode key={node.id} node={node} />
        ))}
      </div>
    </div>
  );
};

export default OrganogramaTree;