import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Draggable } from '@hello-pangea/dnd';
import BoardCard from './BoardCard';
import { modalModeTypes } from './utils';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown'
import { Menu, Form, Input, Modal } from 'antd'
import { CloseOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { updateModal, updateModalMode, updateCurrentListId, updateCardData, updateColumns, updateOrdered } from '../scrumboard/scrumboardreducer/scrumboardSlice';

// ... RenameForm component stays the same ...

const RenameForm = ({ title, finish }) => {
		const [form] = Form.useForm();
	
		const onRenameSubmit = values => {
			finish(values.title)
		};
	
		const onClose = () => {
	    form.submit();
	  };
	 
		return (
			<Form 
				form={form}
				name="renameField" 
				onFinish={onRenameSubmit} 
				layout="vertical"
				autoComplete="off"
				className="w-100"
				initialValues={{
					title: title,
				}}
			>
				<Form.Item name="title" className="mb-0">
					<Input 
						autoFocus 
						value={title} 
						suffix={
							<div className="cursor-pointer" onClick={() => onClose()}>
								<CloseOutlined />
							</div>
						}
					/>
				</Form.Item>
			</Form>
		)
	}
	

const Board = ({ title, contents, index, isScrollable, isCombineEnabled, useClone }) => {
  const dispatch = useDispatch();
  const { columns, ordered } = useSelector((state) => state.scrumboard);
  const [renameActive, setRenameActive] = useState('');

  const newCard = listId => {
    dispatch(updateModal(true));
    dispatch(updateModalMode(modalModeTypes(0)));
    dispatch(updateCurrentListId(listId));
  }  

  const onUpdateCardModal = (obj, listId) => {
    dispatch(updateModal(true));
    dispatch(updateModalMode(modalModeTypes(1)));
    dispatch(updateCurrentListId(listId));
    dispatch(updateCardData(obj));
  }

  const onTitleClick = title => {
			setRenameActive(title)
	}

  const onFinish = newTitle => {
    if(newTitle) {
      const newColumns = {};
      delete Object.assign(newColumns, columns, {[newTitle]: columns[title] })[title];
      const newOrder = ordered.map(elm => {
        if(elm === title) {
          return newTitle
        }
        return elm
      })
      dispatch(updateColumns(newColumns));
      dispatch(updateOrdered(newOrder));
    }
    setRenameActive('');
  };

  const onBoardDelete = title => {
	Modal.confirm({
		title: 'Do you want to delete this board?',
		icon: <ExclamationCircleOutlined />,
		okText: 'Yes',
		cancelText: 'Cancel',
		onOk() {
		  const newOrder = ordered.filter(elm => elm !== title);
		  const newColumns = { ...columns };
		  Object.assign(newColumns, columns)
		  delete newColumns[title];
		  
		  dispatch(updateColumns(newColumns));
		  dispatch(updateOrdered(newOrder));
		},
	  });
		}

  return (
	<Draggable draggableId={title} index={index}>
	{(provided, snapshot) => (
	  <div 
		className="board-column" 
		ref={provided.innerRef} 
		{...provided.draggableProps}
	  >
		<div className="board-title" {...provided.dragHandleProps}>
		  {renameActive === title ? (
			<RenameForm title={title} finish={onFinish} />
		  ) : (
			<>
			  <h4 className="mb-0">{title}</h4>
			  <EllipsisDropdown 
				menu={
				  <Menu>
					<Menu.Item onClick={() => onTitleClick(title)}>
					  <EditOutlined />
					  <span className="ml-2">Rename Board</span>
					</Menu.Item>
					<Menu.Item onClick={() => onBoardDelete(title)}>
					  <DeleteOutlined />
					  <span className="ml-2">Delete Board</span>
					</Menu.Item>
				  </Menu>
				}
			  />
			</>
		  )}
		</div>
		<BoardCard
		  listId={title}
		  listType="CONTENT"
		  className={snapshot.isDragging ? 'is-dragging' : ''}
		  contents={contents}
		  internalScroll={isScrollable}
		  isCombineEnabled={isCombineEnabled}
		  useClone={useClone}
		  cardData={onUpdateCardModal}
		/>
		<div className="board-add" onClick={() => newCard(title)}>
		  <div>Add task</div>
		</div>
	  </div>
	)}
  </Draggable>
		)
}



export default Board;
