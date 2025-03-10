import { createSlice } from '@reduxjs/toolkit';
import { scrumboardData } from '../ScrumboardData';

const initialState = {
  columns: scrumboardData,
  ordered: Object.keys(scrumboardData),
  modal: false,
  modalMode: '',
  currentListId: '',
  cardData: null,
  formValues: {
    cardTitle: '',
    boardTitle: '',
    description: '',
    members: [],
    labels: [],
    attachments: [],
    comments: [],
    dueDate: null,
  },
  
};

export const scrumboardSlice = createSlice({
  name: 'scrumboard',
  initialState,
  reducers: {
    updateOrdered: (state, action) => {
      state.ordered = action.payload;
    },
    updateColumns: (state, action) => {
      state.columns = action.payload;
    },
    updateModal: (state, action) => {
      state.modal = action.payload;
    },
    updateModalMode: (state, action) => {
      state.modalMode = action.payload;
    },
    updateCardData: (state, action) => {
      state.cardData = action.payload;
    },
    addCard: (state, action) => {
        const { listId, cardTitle } = action.payload;
        const newCard = {
          id: Date.now().toString(),
          name: cardTitle,
          description: '',
          members: [],
          labels: [],
          attachments: [],
          comments: [],
          dueDate: null,
          cover: ''
        };
        state.columns[listId].push(newCard);
      },
    addNewCard: (state, action) => {
        const { listId, card } = action.payload;
        state.columns[listId].push(card);
        state.modal = false;
        state.currentListId = '';
      },
  
      updateExistingCard: (state, action) => {
        const { listId, updatedCard } = action.payload;
        state.columns[listId] = state.columns[listId].map(card => 
          card.id === updatedCard.id ? updatedCard : card
        );
        state.modal = false;
      },
  
      addNewBoard: (state, action) => {
        const { boardTitle, currentColumns, currentOrdered } = action.payload;
        
        state.columns[boardTitle] = [];
        
        const newColumns = {};
        const newOrdered = [...currentOrdered, boardTitle];
        
        newOrdered.forEach(boardName => {
          newColumns[boardName] = currentColumns[boardName] || [];
        });
        
        state.columns = newColumns;
        state.ordered = Object.keys(newColumns);
        state.modal = false;
      },
  
      updateCurrentListId: (state, action) => {
        state.currentListId = action.payload;
      },
    updateBoardTitle: (state, action) => {
        const { oldTitle, newTitle } = action.payload;
        if (state.columns[oldTitle]) {
          state.columns[newTitle] = state.columns[oldTitle];
          delete state.columns[oldTitle];
          state.ordered = state.ordered.map(title => 
            title === oldTitle ? newTitle : title
          );
        }
      },
      deleteBoard: (state, action) => {
        const titleToDelete = action.payload;
        delete state.columns[titleToDelete];
        state.ordered = state.ordered.filter(title => title !== titleToDelete);
      },
      setModalOpen: (state, action) => {
        state.modal = action.payload;
      },
      setModalMode: (state, action) => {
        state.modalMode = action.payload;
      },
      setCardData: (state, action) => {
        state.cardData = action.payload;
      },
      setCurrentListId: (state, action) => {
        state.currentListId = action.payload;
      },
      updateFormValues: (state, action) => {
        state.formValues = {
          ...state.formValues,
          ...action.payload
        };
      },
      resetForm: (state) => {
        state.formValues = initialState.formValues;
        state.cardData = null;
      }
  }
});

export const {
  updateOrdered,
  addNewCard,
  updateColumns,
  updateExistingCard,
  updateModal,
  addNewBoard,
  updateModalMode,
  updateCurrentListId,
  updateCardData,
  updateBoardTitle,
  deleteBoard,
  setModalOpen,
  setModalMode,
  setCardData,
  setCurrentListId,
  updateFormValues,
  resetForm
} = scrumboardSlice.actions;

export const selectScrumboard = (state) => state.scrumboard;
export const selectColumns = (state) => state.scrumboard.columns;
export const selectOrdered = (state) => state.scrumboard.ordered;
export const selectModal = (state) => state.scrumboard.modal;
export const selectModalMode = (state) => state.scrumboard.modalMode;
export const selectCurrentListId = (state) => state.scrumboard.currentListId;
export const selectCardData = (state) => state.scrumboard.cardData;

const { addCard } = scrumboardSlice.actions;
export const selectScrumboardForm = state => state.scrumboardForm;



export default scrumboardSlice.reducer;