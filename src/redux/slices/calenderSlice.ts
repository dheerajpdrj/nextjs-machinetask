import { createSlice } from "@reduxjs/toolkit";

interface Event {
  title: string;
  start: Date | string;
  allDay: boolean;
  id: number;
  type: string;
  color: string;
}


const initialState = {
  events: [] as Event[],
  reminders: [] as Event[],
};


const calenderSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    addEvent(state, action) {
      state.events.push(action.payload);
    },
    addReminder(state, action) {
        console.log("payload",action.payload);
      state.reminders.push(action.payload);
      console.log(state.reminders);
      
    },
    deleteEvent(state, action) {
      state.events = state.events.filter(
        (event) => event.id !== action.payload
      );
    },
    deleteReminder(state, action) {
      state.reminders = state.reminders.filter(
        (reminder) => reminder.id !== action.payload
      );
    },
  },
});

export const { addEvent, addReminder, deleteEvent, deleteReminder } =
  calenderSlice.actions;

export default calenderSlice.reducer;
