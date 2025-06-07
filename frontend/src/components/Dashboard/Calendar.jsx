// src/Dashboard/Calendar.jsx
import React, { useState } from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import styles from './Dashboard.module.scss';

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const renderHeader = () => {
    return (
      <div className={styles.calendarHeader}>
        <button onClick={() => setCurrentDate(addDays(currentDate, -7))}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <h2>{format(currentDate, 'MMMM yyyy')}</h2>
        <button onClick={() => setCurrentDate(addDays(currentDate, 7))}>
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const startDate = startOfWeek(currentDate);

    for (let i = 0; i < 7; i++) {
      const day = addDays(startDate, i);
      days.push(
        <div 
          key={i} 
          className={`${styles.day} ${isSameDay(day, selectedDate) ? styles.selected : ''}`}
          onClick={() => setSelectedDate(day)}
        >
          <div className={styles.dayName}>{format(day, 'EEE')}</div>
          <div className={styles.dayNumber}>{format(day, 'd')}</div>
        </div>
      );
    }

    return <div className={styles.daysRow}>{days}</div>;
  };

  const renderEvents = () => {
    // Mock events data
    const events = [
      { id: 1, title: 'Team Meeting', time: '10:00 AM', color: '#BB86FC' },
      { id: 2, title: 'Project Deadline', time: '3:00 PM', color: '#03DAC6' },
      { id: 3, title: 'Code Review', time: '5:30 PM', color: '#CF6679' },
    ];

    return (
      <div className={styles.eventsContainer}>
        <h3>{format(selectedDate, 'EEEE, MMMM d')}</h3>
        {events.length > 0 ? (
          <ul className={styles.eventsList}>
            {events.map(event => (
              <li key={event.id} className={styles.eventItem}>
                <div 
                  className={styles.eventColor} 
                  style={{ backgroundColor: event.color }}
                ></div>
                <div className={styles.eventDetails}>
                  <span className={styles.eventTime}>{event.time}</span>
                  <span className={styles.eventTitle}>{event.title}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.noEvents}>No events scheduled for this day</p>
        )}
      </div>
    );
  };

  return (
    <div className={styles.calendarSection}>
      <div className={styles.sectionHeader}>
        <h2>Calendar</h2>
        <button className={styles.addButton}>
          <i className="fas fa-plus"></i> Add Event
        </button>
      </div>
      <div className={styles.calendarContainer}>
        {renderHeader()}
        {renderDays()}
        {renderEvents()}
      </div>
    </div>
  );
}

export default Calendar;