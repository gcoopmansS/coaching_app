import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "../styles/WorkoutCalendar.css"; // make sure this path matches your structure

export default function WorkoutCalendar({
  events,
  onEventClick,
  onEventDrop,
  editable = false,
  highlightCoachId = null,
}) {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridWeek"
      firstDay={1}
      height="auto"
      editable={editable}
      droppable={editable}
      eventStartEditable={editable}
      eventDurationEditable={false}
      events={events}
      eventClick={onEventClick}
      eventDrop={onEventDrop}
      dayMaxEvents={3}
      headerToolbar={{
        start: "prev,next today",
        center: "title",
        end: "dayGridMonth,dayGridWeek",
      }}
      eventClassNames={({ event }) => {
        const coachId = event.extendedProps?.coachId;
        if (highlightCoachId && coachId) {
          return coachId === highlightCoachId
            ? "fc-event-mine"
            : "fc-event-other";
        }
        return "fc-event-custom";
      }}
      eventContent={(arg) => (
        <span
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          🏃 {arg.event.title}
        </span>
      )}
    />
  );
}
