import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Board from './Board';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { PlusOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import reorder, { reorderQuoteMap } from './reoreder';
import { memberIds } from './ScrumboardData';
import ModalForm from './ModalForm';
import { modalModeTypes, createCardObject, AssigneeAvatar } from './utils';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { 
  updateOrdered, 
  updateColumns, 
  updateModal, 
  updateModalMode, 
  updateCurrentListId,
  selectScrumboard 
} from '../scrumboard/scrumboardreducer/scrumboardSlice';

const ScrumboardWrapper = props => {
  const dispatch = useDispatch();
  const { 
    ordered,
    columns,
    modal,
    cardData,
    currentListId,
    modalMode 
  } = useSelector(selectScrumboard);

  const onDragEnd = result => {
    if (result.combine) {
      if (result.type === 'COLUMN') {
        const shallow = [...ordered];
        shallow.splice(result.source.index, 1);
        dispatch(updateOrdered(shallow));
        return;
      }

      const column = columns[result.source.droppableId];
      const withQuoteRemoved = [...column];
      withQuoteRemoved.splice(result.source.index, 1);
      const newColumns = {
        ...columns,
        [result.source.droppableId]: withQuoteRemoved,
      };
      dispatch(updateColumns(newColumns));
      return;
    }

    if (!result.destination) {
      return;
    }

    const source = result.source;
    const destination = result.destination;

    if (source.droppableId === destination.droppableId && 
        source.index === destination.index) {
      return;
    }

    if (result.type === 'COLUMN') {
      const newOrdered = reorder(
        ordered,
        source.index,
        destination.index,
      );
      dispatch(updateOrdered(newOrdered));
      return;
    }

    const data = reorderQuoteMap({
      quoteMap: columns,
      source,
      destination,
    });
    dispatch(updateColumns(data.quoteMap));
  };

  const onCloseModal = () => {
    dispatch(updateModal(false));
  };


const onModalSubmit = (values, mode) => {
	    const data = { ...columns };
		
	    if(mode === modalModeTypes(0)) {
	      let newCard = createCardObject();
	      newCard.name = values.cardTitle || 'Untitled Card';
	      data[currentListId].push(newCard);
	      dispatch(updateColumns(data));
	      dispatch(updateModal(false));
	      dispatch(updateCurrentListId(''));
	    }
	
	    if(mode === modalModeTypes(1)) {
	      const updatedCard = data[currentListId].map(elm => 
	        values.id === elm.id ? values : elm
	      );
	      data[currentListId] = updatedCard;
	      dispatch(updateColumns(data));
	      dispatch(updateModal(false));
	    }
	
	    if(mode === modalModeTypes(2)) {
	      const boardTitle = values.boardTitle || 'Untitled Board';
	      data[boardTitle] = [];
	      const newOrdered = [...ordered, boardTitle];
	      const newColumns = {};
	      newOrdered.forEach(elm => {
	        newColumns[elm] = data[elm];
	      });
	      dispatch(updateColumns(newColumns));
	      dispatch(updateOrdered(Object.keys(newColumns)));
	      dispatch(updateModal(false));
	    }
	  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        {props.containerHeight ? (
          <div className="scrumboard">
            <BoardWrapper {...props}/>
          </div>
        ) : (
          <BoardWrapper {...props}/>
        )}
      </DragDropContext>
      <ModalForm 
        open={modal} 
        onClose={onCloseModal} 
        onModalSubmit={onModalSubmit}
        modalMode={modalMode}
        cardData={cardData}
        listId={currentListId}
      />
    </>
  );
};

const BoardWrapper = ({ 
  containerHeight, 
  useClone, 
  isCombineEnabled, 
  withScrollableColumns 
}) => {
  const dispatch = useDispatch();
  const { ordered, columns } = useSelector(selectScrumboard);

  const onAddBoardModal = () => {
    dispatch(updateModal(true));
    dispatch(updateModalMode(modalModeTypes(2)));
  };

  return (
    <Droppable
      droppableId="board"
      type="COLUMN"
      direction="horizontal"
      ignoreContainerClipping={containerHeight}
      isCombineEnabled={isCombineEnabled}
    >
      {(provided) => (
        <div className="scrumboard" ref={provided.innerRef} {...provided.droppableProps}>
          <div className="scrumboard-header">
            <div>
              {/* <h3>Backlog</h3> */}
            </div>
            <div className="text-right">
              <div className="d-flex align-items-center">
                {memberIds.map((member, i) => 
                  i < 4 ? (
                    <AssigneeAvatar 
                      key={member} 
                      id={member} 
                      size={30} 
                      chain
                    />
                  ) : null
                )}
                <Avatar className="ml-n2" size={30}>
                  <span className="text-gray font-weight-semibold font-size-base">
                    +9
                  </span>
                </Avatar>
              </div>
            </div>
          </div>
          <Scrollbars className="scrumboard-body">
            {ordered.map((key, index) => (
              <Board
                key={key}
                index={index}
                title={key}
                contents={columns[key]}
                isScrollable={withScrollableColumns}
                isCombineEnabled={isCombineEnabled}
                useClone={useClone}
              />
            ))}
            {provided.placeholder}
            <div className="board-column add">
              <div className="board-title" onClick={onAddBoardModal}>
                <h4 className="mb-0">
                  <PlusOutlined />
                  <span>Add List</span>
                </h4>
              </div>
            </div>
          </Scrollbars>
        </div>
      )}
    </Droppable>
  );
};

const Scrumboard = props => {
  return <ScrumboardWrapper {...props} />;
};

export default Scrumboard;

