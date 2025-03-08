import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import EventService from './EventSetupService';
// import { AUTH_TOKEN } from 'constants/AuthConstant';

export const fetchEventsData = createAsyncThunk(
  'events/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await EventService.fetchEvents();
      return response.data; // Assuming the data is nested under 'data' in the response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch events');
    }
  }
);

export const createEventData = createAsyncThunk(
  'events/createEvent',
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await EventService.createEvent(eventData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create event');
    }
  }
);

export const getEventById = createAsyncThunk(
  'events/getEventById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await EventService.getEventById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const UpdateEventsetUp = createAsyncThunk(
  'events/updateEventsetUp',
  async ({ id, eventData  }, thunkAPI) => {
    try {
      const response = await EventService.updateEventsetUp(id, eventData );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const deleteEventData = createAsyncThunk(
  'events/deleteEvent',
  async (id, thunkAPI) => {
      try {
          const response = await EventService.deleteEvent(id);
          return response;
      } catch (error) {
          return thunkAPI.rejectWithValue(error);
      }
  }
);



const eventSlice = createSlice({
  name: 'events',
  initialState: {
    events: [],
    // event: null,
    selectedEvent: null,
    loading: false,
    error: null,
    success: false,
    message: '',
    // AUTH_TOKEN:"",
  },
  reducers: {
    setSelectedEvent: (state, action) => {
      state.selectedEvent = action.payload;
    },
    clearEventState: (state) => {
      state.error = null;
      state.success = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Events
      .addCase(fetchEventsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventsData.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
        state.success = true;
        state.message = 'Events fetched successfully';
      })
      .addCase(fetchEventsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Create Event

      .addCase(createEventData.fulfilled, (state, action) => {
        state.events.push(action.payload); // Add the newly created event to the state
      })
      .addCase(createEventData.rejected, (state, action) => {
        state.error = action.payload;
      })
      // .addCase(createEventData.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(createEventData.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.events.push(action.payload);
      //   state.success = true;
      //   state.message = 'Event scheduled successfully!';
      // })
      // .addCase(createEventData.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload;
      //   state.success = false;
      // })
      // get event by id
      .addCase(getEventById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEvent = action.payload;
        state.error = null;
      })
      .addCase(getEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Edit Event
      .addCase(UpdateEventsetUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(UpdateEventsetUp.fulfilled, (state, action) => {
        state.loading = false;

        state.events = state.events.findIndex(event => event._id === action.payload._id);// Ensure `action.payload.user` exists
        // state.token = action.payload.token;
      })
      .addCase(UpdateEventsetUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Delete Event
      .addCase(deleteEventData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEventData.fulfilled, (state, action) => {
        state.loading = false;
        // state.token = action.payload.token;
        state.events = state.events.filter((event) => event.id !== action.meta.arg);
        // state.events = state.events.filter((event) => event._id !== action.payload);
        state.success = true;
        state.message = 'Event deleted successfully';
      })
      .addCase(deleteEventData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

  },
});

export const { clearEventState, setSelectedEvent } = eventSlice.actions;
export default eventSlice.reducer;
