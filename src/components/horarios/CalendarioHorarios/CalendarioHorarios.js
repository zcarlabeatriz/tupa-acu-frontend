import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pt-br';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Card, Button, Modal } from 'react-bootstrap';
import './CalendarioHorarios.css';

moment.locale('pt-br');
const localizer = momentLocalizer(moment);

const CalendarioHorarios = ({ data = [] }) => {
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const messages = {
    allDay: 'Dia inteiro',
    previous: 'Anterior',
    next: 'Próximo',
    today: 'Hoje',
    month: 'Mês',
    week: 'Semana',
    day: 'Dia',
    agenda: 'Agenda',
    date: 'Data',
    time: 'Horário',
    event: 'Evento',
    noEventsInRange: 'Não há eventos neste período',
    showMore: total => `+ Ver mais (${total})`
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: event.color || '#3b82f6',
        borderRadius: '4px',
        opacity: 0.8,
        border: 'none',
        color: 'white',
        fontSize: '12px'
      }
    };
  };

  return (
    <div className="calendario-horarios">
      <Card>
        <Card.Header>
          <h6 className="mb-0">
            <i className="fas fa-calendar me-2"></i>
            Visualização do Calendário
          </h6>
        </Card.Header>
        <Card.Body style={{ height: '600px' }}>
          <Calendar
            localizer={localizer}
            events={data}
            startAccessor="start"
            endAccessor="end"
            titleAccessor="title"
            messages={messages}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyleGetter}
            views={['month', 'week', 'day']}
            defaultView="month"
            popup
            step={30}
            timeslots={2}
            min={new Date(2025, 0, 1, 6, 0)}
            max={new Date(2025, 0, 1, 22, 0)}
          />
        </Card.Body>
      </Card>

      {/* Modal de Detalhes do Evento */}
      <Modal show={showEventModal} onHide={() => setShowEventModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Detalhes do Evento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <div>
              <h6>{selectedEvent.title}</h6>
              <p><strong>Tipo:</strong> {selectedEvent.type === 'config' ? 'Configuração' : 'Bloqueio'}</p>
              <p><strong>Início:</strong> {moment(selectedEvent.start).format('DD/MM/YYYY HH:mm')}</p>
              <p><strong>Fim:</strong> {moment(selectedEvent.end).format('DD/MM/YYYY HH:mm')}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEventModal(false)}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CalendarioHorarios;