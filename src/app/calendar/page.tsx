"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import { useDispatch, useSelector } from "react-redux";
import {
  addEvent,
  addReminder,
  deleteEvent,
  deleteReminder,
} from "@/redux/slices/calenderSlice";

interface Event {
  title: string;
  start: Date | string;
  allDay: boolean;
  id: number;
  type: string;
  color: string;
}

interface RootState {
  calender: {
    events: Event[];
    reminders: Event[];
  };
}

const initialEventState: Event = {
  title: "",
  start: "",
  allDay: false,
  id: 0,
  type: "event",
  color: "blue",
};

const initialReminderState: Event = {
  title: "",
  start: "",
  allDay: false,
  id: 0,
  type: "reminder",
  color: "orange",
};

export default function Calendar() {
  const dispatch = useDispatch();
  const events = useSelector((state: RootState) => state?.calender?.events);
  const reminders = useSelector(
    (state: RootState) => state?.calender?.reminders
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [type, setType] = useState<string>("");
  const [newEvent, setNewEvent] = useState<Event>(initialEventState);
  const [newReminder, setNewReminder] = useState<Event>(initialReminderState);

  const handleDateClick = (arg: { date: Date; allDay: boolean }) => {
    setNewEvent({
      ...newEvent,
      start: arg.date,
      allDay: arg.allDay,
      id: new Date().getTime(),
      type: "event",
    });
    setNewReminder({
      ...newReminder,
      start: arg.date,
      allDay: arg.allDay,
      id: new Date().getTime(),
      type: "remainder",
    });
    setShowModal(true);
  };

  const handleDeleteModal = (data: any) => {
    setType(data.event.extendedProps.type);
    setShowDeleteModal(true);
    setIdToDelete(Number(data.event.id));
  };

  const handleDelete = () => {
    dispatch(
      type === "event" ? deleteEvent(idToDelete) : deleteReminder(idToDelete)
    );
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setType("");
    setIdToDelete(null);
    setNewEvent(initialEventState);
    setNewReminder(initialReminderState);
    setShowDeleteModal(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (type === "event") {
      setNewEvent({ ...newEvent, [name]: value });
    } else {
      setNewReminder({ ...newReminder, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(type === "event" ? addEvent(newEvent) : addReminder(newReminder));
    setShowModal(false);
    setType("");
    setNewEvent(initialEventState);
    setNewReminder(initialReminderState);
  };

  return (
    <>
      <nav className="flex justify-between mb-12 border-b border-violet-100 p-4">
        <h1 className="font-bold text-2xl text-white">Calendar</h1>
      </nav>
      <main className="flex min-h-screen flex-col items-center w-full">
        <div className="overflow-auto">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "resourceTimelineWook, dayGridMonth,timeGridWeek",
            }}
            eventColor={([...events, ...reminders] as any).map(
              (event: any) => event.color
            )}
            events={[...events, ...reminders] as any}
            initialView="dayGridMonth"
            nowIndicator={true}
            editable={true}
            droppable={true}
            selectable={true}
            selectMirror={true}
            dateClick={handleDateClick}
            eventClick={(data) => handleDeleteModal(data)}
          />
        </div>
        <Transition.Root show={showDeleteModal} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={setShowDeleteModal}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                          <ExclamationTriangleIcon
                            className="h-6 w-6 text-red-600"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                          <Dialog.Title
                            as="h3"
                            className="text-base font-semibold leading-6 text-gray-900"
                          >
                            {`Delete ${type}`}
                          </Dialog.Title>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">{`Are you sure you want to delete this ${type}?`}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                        onClick={handleDelete}
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        onClick={handleCloseModal}
                      >
                        Cancel
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
        <Transition.Root show={showModal} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={setShowModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                    <div>
                      {type === "" && (
                        <div className="flex flex-col gap-4">
                          <button
                            onClick={() => setType("event")}
                            className="w-full inline-flex justify-center rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                          >
                            Add Event
                          </button>
                          <button
                            onClick={() => setType("reminder")}
                            className="w-full inline-flex justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset"
                          >
                            Add Reminder
                          </button>
                        </div>
                      )}
                      {type === "event" && (
                        <form onSubmit={handleSubmit}>
                          <div className="mt-2">
                            <input
                              type="text"
                              name="title"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
                              value={newEvent.title}
                              onChange={handleChange}
                              placeholder="Title"
                            />
                          </div>
                          <button
                            type="submit"
                            className="inline-flex w-full justify-center rounded-md bg-violet-600 px-3 py-2 mt-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 sm:col-start-2 disabled:opacity-25"
                            disabled={newEvent.title === ""}
                          >
                            Set Event
                          </button>
                        </form>
                      )}
                      {type === "reminder" && (
                        <form onSubmit={handleSubmit}>
                          <div className="mt-2">
                            <input
                              type="text"
                              name="title"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
                              value={newReminder.title}
                              onChange={handleChange}
                              placeholder="Title"
                            />
                          </div>
                          <button
                            type="submit"
                            className="inline-flex w-full justify-center rounded-md bg-violet-600 px-3 py-2 mt-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 sm:col-start-2 disabled:opacity-25"
                            disabled={newReminder.title === ""}
                          >
                            Set Remainder
                          </button>
                        </form>
                      )}
                      <button
                        onClick={handleCloseModal}
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </main>
    </>
  );
}
