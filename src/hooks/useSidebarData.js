import { useState, useEffect, useCallback, useRef } from 'react';
import { dashboardService } from '../services/api/dashboardService';
import { visitasService } from '../services/api/visitasService';
import { notificationsService } from '../services/api/notificationsService';
import { useAuth } from '../context/AuthContext';

export const useSidebarData = () => {
  const [badges, setBadges] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const { user } = useAuth();

  const isLoadingRef = useRef(false);
  const userRoleRef = useRef(null);

  const fetchSidebarData = useCallback(async () => {
    const currentUser = userRoleRef.current;
    if (!currentUser || isLoadingRef.current) return;
    
    try {
      isLoadingRef.current = true;
      setLoading(true);
      setError(null);
      
      const promises = [];
      const newBadges = {};

      // Buscar dados do dashboard se o usuário tiver permissão
      if (currentUser.papel === 'ADMIN' || currentUser.papel === 'RECEPCIONISTA') {
        promises.push(
          dashboardService.getDashboardStats()
            .then(stats => {
              if (stats?.totalNotificacoes) {
                newBadges['/dashboard'] = {
                  count: stats.totalNotificacoes,
                  variant: 'info',
                  tooltip: `${stats.totalNotificacoes} notificações`
                };
              }
            })
            .catch(err => console.warn('Erro ao buscar stats do dashboard:', err))
        );
      }

      // Buscar visitas pendentes
      promises.push(
        visitasService.listarTodas()
          .then(visitas => {
            const visitasPendentes = visitas?.filter(v => 
              v.status === 'AGENDADA' || v.status === 'PENDENTE'
            ) || [];
            
            if (visitasPendentes.length > 0) {
              newBadges['/visitas'] = {
                count: visitasPendentes.length,
                variant: 'warning',
                tooltip: `${visitasPendentes.length} visitas pendentes`
              };
            }
          })
          .catch(err => console.warn('Erro ao buscar visitas:', err))
      );

      // Buscar notificações não lidas
      promises.push(
        notificationsService.contarNaoLidas()
          .then(count => {
            if (count && count > 0) {
              newBadges['/notifications'] = {
                count: count,
                variant: 'danger',
                tooltip: `${count} notificações não lidas`
              };
            }
          })
          .catch(err => console.warn('Erro ao buscar notificações:', err))
      );

      // Aguardar todas as requisições
      await Promise.allSettled(promises);
      
      setBadges(newBadges);
    } catch (err) {
      console.error('Erro ao buscar dados da sidebar:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, []);

  // Atualizar referência do usuário
  useEffect(() => {
    userRoleRef.current = user;
  }, [user]);

  // Buscar dados na montagem do componente apenas uma vez
  useEffect(() => {
    if (user?.papel && !initialized) {
      setInitialized(true);
      fetchSidebarData();
    }
  }, [user?.papel, initialized, fetchSidebarData]);

  // Função para atualizar dados manualmente
  const refreshData = useCallback(() => {
    if (userRoleRef.current?.papel) {
      fetchSidebarData();
    }
  }, [fetchSidebarData]);

  // Função para obter badge de um item específico
  const getItemBadge = useCallback((path) => {
    return badges[path] || null;
  }, [badges]);

  return {
    badges,
    loading,
    error,
    refreshData,
    getItemBadge
  };
};