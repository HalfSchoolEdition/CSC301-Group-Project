"use client";

import Header from '../../components/Header';
import { useState, useEffect } from 'react';
import { Profile } from '../../types/Authentication';
import Link from 'next/link';

interface Event {
  id: string;
  title: string;
  club: string;
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
  description?: string;
}

const admins = [1, 9]; // Hard-coded admin user IDs

const apiBase =
  typeof window !== 'undefined' && window.location.hostname === '127.0.0.1'
    ? 'http://127.0.0.1:5000'
    : 'http://localhost:5000';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedClub, setSelectedClub] = useState<string>('all');
  const [showPastEvents, setShowPastEvents] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [reviewPending, setReviewPending] = useState(false);
  const [pendingEvents, setPendingEvents] = useState<Event[]>([]);

  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    org: "",
    date: "",
    time: "",
    location: "",
    desc: ""
  });

  // ---------------- Helpers ----------------
  const addOneHour = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    const newHour = (h + 1) % 24;
    return `${String(newHour).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes}${ampm}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getClubColor = (club: string) => {
    const colors: { [key: string]: string } = {
      'CS Club': 'bg-slate-200/80 text-slate-700 dark:bg-white/10 dark:text-zinc-200 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-indigo-500 hover:text-white',
      'Tech Society': 'bg-slate-200/80 text-slate-700 dark:bg-white/10 dark:text-zinc-200 hover:bg-gradient-to-r hover:from-fuchsia-500 hover:to-cyan-500 hover:text-white',
      'Math Society': 'bg-slate-200/80 text-slate-700 dark:bg-white/10 dark:text-zinc-200 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-cyan-500 hover:text-white',
    };
    return colors[club] || 'bg-slate-200/80 text-slate-700 dark:bg-white/10 dark:text-zinc-200 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-indigo-500 hover:text-white';
  };

  // ---------------- Fetch Current User ----------------
  const fetchCurrentUser = async () => {
    const currUser = await Profile();
    if (currUser) setCurrentUserId(currUser.id);
    setLoading(false);
  };

  // ---------------- Fetch Events ----------------
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const month = currentMonth.getMonth() + 1;
      const res = await fetch(`${apiBase}/calendar/${month}`);
      if (!res.ok) return;
      const data = await res.json();

      const mapped: Event[] = data.map((e: any) => ({
        id: String(e.id),
        title: e.name,
        club: e.org,
        date: e.date,
        startTime: e.time,
        endTime: addOneHour(e.time),
        location: e.location,
        description: e.desc,
      }));

      setEvents(mapped);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingEvents = async () => {
    try {
      const res = await fetch(`${apiBase}/calendar/pending`);
      if (!res.ok) return;
      const data = await res.json();

      const mapped: Event[] = data.map((e: any) => ({
        id: String(e.id),
        title: e.name,
        club: e.org,
        date: e.date,
        startTime: e.time,
        endTime: addOneHour(e.time),
        location: e.location,
        description: e.desc,
      }));

      setPendingEvents(mapped);
    } catch (err) {
      console.error("Error fetching pending events:", err);
    }
  };

  // ---------------- Create Event ----------------
  const createEvent = async () => {
    try {
      const res = await fetch(`${apiBase}/calendar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (!res.ok) {
        console.error("Failed to create event");
        return;
      }
      setShowCreateModal(false);
      fetchEvents();
      setFormData({ name: "", org: "", date: "", time: "", location: "", desc: "" });
    } catch (err) {
      console.error("Error creating event:", err);
    }
  };

  // ---------------- Admin Actions ----------------
  const acceptEvent = async (id: string) => {
    try {
      const res = await fetch(`${apiBase}/calendar/accept/${id}`, { method: 'POST' });
      if (res.ok) fetchPendingEvents();
    } catch (err) { console.error(err); }
  };

  const declineEvent = async (id: string) => {
    try {
      const res = await fetch(`${apiBase}/calendar/decline/${id}`, { method: 'POST' });
      if (res.ok) fetchPendingEvents();
    } catch (err) { console.error(err); }
  };

  // ---------------- Calendar Logic ----------------
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return { daysInMonth: lastDay.getDate(), startingDayOfWeek: firstDay.getDay(), year, month };
  };

  const getEventsForDay = (day: number) => {
    const { year, month } = getDaysInMonth(currentMonth);
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events.filter(e => {
      const eventDate = new Date(e.date);
      if (e.date !== dateStr) return false;
      if (selectedClub !== 'all' && e.club !== selectedClub) return false;
      if (!showPastEvents && eventDate < today) return false;
      if (searchQuery && !e.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  };

  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

  const allClubs = Array.from(new Set(events.map(e => e.club))).sort();
  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // ---------------- Render Days ----------------
  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) days.push(<div key={`empty-${i}`} className="min-h-24 bg-slate-100/70 dark:bg-zinc-950/50" />);
  for (let day = 1; day <= daysInMonth; day++) {
    const dayEvents = getEventsForDay(day);
    days.push(
      <div key={day} className="min-h-24 border border-slate-200/70 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 backdrop-blur p-2">
        <div className="font-semibold text-slate-900 dark:text-zinc-100">{day}</div>
        {dayEvents.map(event => (
          <div key={event.id} className={`text-xs p-1 mt-1 rounded cursor-pointer transition-all ${getClubColor(event.club)}`} onClick={() => setSelectedEvent(event)}>
            {formatTime(event.startTime)} {event.title}
          </div>
        ))}
      </div>
    );
  }

  // ---------------- UseEffect ----------------
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    fetchEvents();
    if (currentUserId !== null && admins.includes(currentUserId)) fetchPendingEvents();
  }, [currentMonth, currentUserId]);

  // ---------------- Render ----------------
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-100 text-slate-900 dark:bg-[#0b0c10] dark:text-zinc-100">
      <div className="pointer-events-none absolute -left-20 -top-16 h-80 w-80 rounded-full bg-white/70 blur-3xl dark:bg-white/10" />
      <div className="pointer-events-none absolute right-0 top-24 h-96 w-96 rounded-full bg-slate-300/35 blur-3xl dark:bg-zinc-600/15" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-slate-200/40 blur-3xl dark:bg-zinc-500/10" />
      <Header />

      <div className="relative z-10 px-6 pt-6">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
            Event Calendar
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">Browse campus events and review requests.</p>
        </div>

        <div className="flex w-full gap-6">
        {/* Sidebar */}
        <aside className="w-64 bg-white/65 dark:bg-zinc-900/50 p-6 shadow-sm rounded-3xl space-y-4 h-fit border border-slate-200/80 dark:border-white/10 backdrop-blur-xl shrink-0">
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full border border-slate-300 bg-white/60 text-slate-800 py-2 rounded-lg hover:border-transparent hover:bg-gradient-to-r hover:from-cyan-500 hover:to-indigo-500 hover:text-white transition-all"
          >
            + Request Event
          </button>

          {currentUserId !== null && admins.includes(currentUserId) && (
            <button
              onClick={() => setReviewPending(prev => !prev)}
              className="w-full border border-slate-300 bg-white/60 text-slate-800 py-2 rounded-lg hover:border-transparent hover:bg-gradient-to-r hover:from-amber-400 hover:to-orange-500 hover:text-white transition-all"
            >
              Review Pending
            </button>
          )}

          <input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-slate-300 p-2 rounded-lg bg-white/80 dark:bg-zinc-950/80 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />

          <label className="flex items-center gap-2 mt-2 cursor-pointer">
            <input type="checkbox" checked={showPastEvents} onChange={(e) => setShowPastEvents(e.target.checked)} className="rounded border-slate-300 dark:bg-zinc-900 dark:border-zinc-700" />
            <span>Show Past</span>
          </label>

          <select value={selectedClub} onChange={(e) => setSelectedClub(e.target.value)} className="w-full mt-2 border border-slate-300 p-2 rounded-lg bg-white/80 dark:bg-zinc-950/80 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-cyan-500">
            <option value="all">All Clubs</option>
            {allClubs.map(club => <option key={club}>{club}</option>)}
          </select>

          <Link
            href="/eventshuffle"
            className="block w-full text-center border border-slate-300 bg-white/60 text-slate-800 dark:border-white/15 dark:bg-white/5 dark:text-zinc-100 py-2 rounded-lg hover:border-transparent hover:bg-gradient-to-r hover:from-cyan-500 hover:to-indigo-500 hover:text-white transition-all"
          >
            Open Event Shuffle
          </Link>
        </aside>

        {/* Main */}
        <main className="flex-1 space-y-6 min-w-0">
          {!reviewPending ? (
            <div className="bg-white/70 dark:bg-zinc-900/60 p-6 shadow-sm rounded-3xl border border-slate-200/80 dark:border-white/10 backdrop-blur-xl">
              <div className="flex justify-between items-center mb-6">
                <button onClick={prevMonth} className="p-2 hover:bg-white dark:hover:bg-zinc-800 rounded-lg border border-slate-200/70 dark:border-white/10">←</button>
                <h2 className="text-xl font-bold">{monthName}</h2>
                <button onClick={nextMonth} className="p-2 hover:bg-white dark:hover:bg-zinc-800 rounded-lg border border-slate-200/70 dark:border-white/10">→</button>
              </div>

              {loading ? (
                <p className="text-center py-10 text-gray-500 dark:text-zinc-400">Loading events...</p>
              ) : (
                <div className="grid grid-cols-7 border-l border-t border-slate-200/70 dark:border-zinc-800 rounded overflow-hidden">
                  {/* Day Headers */}
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center py-2 text-sm font-semibold bg-slate-100/70 dark:bg-zinc-950/50 border-r border-b border-slate-200/70 dark:border-zinc-800">
                      {day}
                    </div>
                  ))}
                  {days}
                </div>
              )}
            </div>
          ) : (
            // ---------------- Pending Events for Admin ----------------
            <div className="bg-white/70 dark:bg-zinc-900/60 p-6 shadow-sm rounded-3xl space-y-4 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl">
              <h2 className="text-xl font-bold mb-4">Pending Event Requests</h2>
              {pendingEvents.length === 0 ? (
                <p className="text-gray-500 dark:text-zinc-400">No pending events.</p>
              ) : pendingEvents.map(event => (
                <div key={event.id} className="border border-slate-200/80 dark:border-zinc-700 p-4 rounded-2xl space-y-2 bg-white/75 dark:bg-zinc-950/30 backdrop-blur">
                  <h3 className="font-semibold text-lg">{event.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-zinc-400">Club: <span className="text-gray-900 dark:text-zinc-200">{event.club}</span></p>
                  <p className="text-sm text-gray-600 dark:text-zinc-400">Date: <span className="text-gray-900 dark:text-zinc-200">{formatDate(event.date)}</span></p>
                  <p className="text-sm text-gray-600 dark:text-zinc-400">Time: <span className="text-gray-900 dark:text-zinc-200">{formatTime(event.startTime)} - {formatTime(event.endTime)}</span></p>
                  <p className="text-sm text-gray-600 dark:text-zinc-400">Location: <span className="text-gray-900 dark:text-zinc-200">{event.location}</span></p>
                  <p className="text-sm text-gray-600 dark:text-zinc-400">Description: <span className="text-gray-900 dark:text-zinc-200">{event.description}</span></p>
                  <div className="flex gap-2 pt-2">
                    <button onClick={() => acceptEvent(event.id)} className="border border-slate-300 bg-white/60 text-slate-800 px-4 py-2 rounded-lg hover:border-transparent hover:bg-gradient-to-r hover:from-emerald-500 hover:to-cyan-500 hover:text-white transition-all">Accept</button>
                    <button onClick={() => declineEvent(event.id)} className="border border-slate-300 bg-white/60 text-slate-800 px-4 py-2 rounded-lg hover:border-transparent hover:bg-gradient-to-r hover:from-rose-500 hover:to-orange-500 hover:text-white transition-all">Decline</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center sm:justify-end items-center sm:items-stretch p-4 sm:p-6 z-50"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-white/80 dark:bg-zinc-900/75 w-full sm:w-96 rounded-3xl shadow-xl p-6 space-y-4 border border-slate-200/80 dark:border-white/10 backdrop-blur-xl h-fit sm:h-auto overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold text-gray-800 dark:text-zinc-100">
                {selectedEvent.title}
              </h2>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300 text-lg"
              >
                ✕
              </button>
            </div>

            {/* Club Tag */}
            <div>
              <span
                className={`inline-block px-3 py-1 text-sm rounded-full font-medium ${getClubColor(
                  selectedEvent.club
                )}`}
              >
                {selectedEvent.club}
              </span>
            </div>

            {/* Details */}
            <div className="space-y-3 text-sm text-gray-700 dark:text-zinc-300">
              <div className="flex items-center gap-2">
                <span>📅</span>
                <span>
                  <strong className="text-gray-900 dark:text-zinc-100">Date:</strong> {formatDate(selectedEvent.date)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span>⏰</span>
                <span>
                  <strong className="text-gray-900 dark:text-zinc-100">Time:</strong>{" "}
                  {formatTime(selectedEvent.startTime)} –{" "}
                  {formatTime(selectedEvent.endTime)}
                </span>
              </div>

              {selectedEvent.location && (
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span>
                    <strong className="text-gray-900 dark:text-zinc-100">Location:</strong> {selectedEvent.location}
                  </span>
                </div>
              )}

              {selectedEvent.description && (
                <div className="pt-3 border-t dark:border-zinc-700">
                  <p className="text-gray-500 dark:text-zinc-400 text-xs mb-1">Description</p>
                  <p className="leading-relaxed">
                    {selectedEvent.description}
                  </p>
                </div>
              )}
            </div>

            {/* Footer Action */}
            <div className="pt-4 border-t dark:border-zinc-700 flex justify-end">
              <button
                onClick={() => setSelectedEvent(null)}
                className="border border-slate-300 bg-white/60 text-slate-800 px-4 py-2 rounded-lg hover:border-transparent hover:bg-gradient-to-r hover:from-cyan-500 hover:to-indigo-500 hover:text-white transition-all text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white/80 dark:bg-zinc-900/75 p-6 rounded-3xl w-full max-w-md space-y-4 shadow-xl border border-slate-200/80 dark:border-white/10 backdrop-blur-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold dark:text-zinc-100">Request New Event</h2>
            
            <div className="space-y-3">
              <input name="name" placeholder="Event Name" value={formData.name} onChange={handleChange} className="w-full border border-slate-300 p-3 rounded-lg bg-white/80 dark:bg-zinc-950/80 dark:border-zinc-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
              <input name="org" placeholder="Club" value={formData.org} onChange={handleChange} className="w-full border border-slate-300 p-3 rounded-lg bg-white/80 dark:bg-zinc-950/80 dark:border-zinc-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
              <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full border border-slate-300 p-3 rounded-lg bg-white/80 dark:bg-zinc-950/80 dark:border-zinc-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 color-scheme-light dark:[color-scheme:dark]" />
              <input type="time" name="time" value={formData.time} onChange={handleChange} className="w-full border border-slate-300 p-3 rounded-lg bg-white/80 dark:bg-zinc-950/80 dark:border-zinc-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 color-scheme-light dark:[color-scheme:dark]" />
              <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="w-full border border-slate-300 p-3 rounded-lg bg-white/80 dark:bg-zinc-950/80 dark:border-zinc-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
              <textarea name="desc" placeholder="Description" rows={3} value={formData.desc} onChange={handleChange} className="w-full border border-slate-300 p-3 rounded-lg bg-white/80 dark:bg-zinc-950/80 dark:border-zinc-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none" />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowCreateModal(false)} className="border border-slate-300 bg-white/60 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 px-5 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-700 transition-all">Cancel</button>
              <button onClick={createEvent} className="border border-slate-300 bg-white/60 text-slate-800 px-5 py-2 rounded-lg hover:border-transparent hover:bg-gradient-to-r hover:from-cyan-500 hover:to-indigo-500 hover:text-white transition-all">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}