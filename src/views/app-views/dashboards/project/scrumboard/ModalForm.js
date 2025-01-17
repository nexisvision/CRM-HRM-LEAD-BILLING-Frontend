import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Modal, 
  Form, 
  Input, 
  Button, 
  Select, 
  DatePicker, 
  Divider, 
  Card, 
  Tag,
  Avatar, 
  Badge,
  Dropdown 
} from 'antd';
import { 
  FileTextOutlined,
  PaperClipOutlined,
  CommentOutlined,
  StarFilled,
  StarOutlined,
  DeleteOutlined,
  EllipsisOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { 
  memberIds, 
  labels,
  scrumboardData 
} from './ScrumboardData';
import { 
	modalModeTypes, AssigneeAvatar, getLabelsColor, getCover, createCommentObject 
} from './utils';
import { 
  updateColumns,
  selectScrumboard 
} from '../scrumboard/scrumboardreducer/scrumboardSlice';

const { DATE_FORMAT_DD_MM_YYYY } = require('constants/DateConstant');



const AddCardForm = ({ onSubmit }) => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    if (!values.cardTitle?.trim()) {
      return;
    }
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Form 
      form={form}
      layout="inline" 
      name="add-card-ref" 
      onFinish={handleSubmit}
    >
      <Form.Item 
        name="cardTitle" 
        label="Card Title"
        rules={[
          { 
            required: true, 
            message: 'Please input card title!' 
          }
        ]}
      >
        <Input 
          autoComplete="off"
          placeholder="Enter card title"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add
        </Button>
      </Form.Item>
    </Form>
  );
};

const UpdateCardForm = ({ onSubmit, cardData, listId }) => {
  const dispatch = useDispatch();
  const { columns } = useSelector(selectScrumboard);

  const [attachmentsList, setAttachmentsList] = useState(cardData.attachments);
  const [commentsList, setCommentsList] = useState(cardData.comments);
  const [cover, setCover] = useState(cardData.cover);

  const commentInput = useRef();

  useEffect(() => {
    setAttachmentsList(cardData.attachments);
    setCommentsList(cardData.comments);
    setCover(cardData.cover);
  }, [cardData.attachments, cardData.comments, cardData.cover]);

  const initialValues = {
    name: cardData?.name,
    members: cardData?.members,
    dueDate: cardData?.dueDate ? dayjs(cardData.dueDate) : '',
    labels: cardData?.labels,
    description: cardData?.description,
  };

  const onCoverChange = id => {
    const updatedCover = getCover(id, attachmentsList);
    updateAttachment(updatedCover);
  };

  const submitUpdate = values => {
    let updatedValue = {
      ...values,
      attachments: attachmentsList,
      comments: commentsList,
      cover: cover,
      id: cardData.id
    };
    onSubmit(updatedValue);
  };

  const updateAttachment = (updatedCover) => {
    const newColumns = { ...columns };
    const updatedCards = newColumns[listId].map(elm => {
      if(elm.id === cardData.id) {
        return {
          ...elm,
          attachments: attachmentsList,
          cover: updatedCover
        };
      }
      return elm;
    });
    newColumns[listId] = updatedCards;
    dispatch(updateColumns(newColumns));
  };

  const removeCover = () => {
    updateAttachment('');
  };

  const memberTagRender = (props) => <AssigneeAvatar id={props.value} size={25} />

function labelTagRender(props) {
  const { value } = props;
  return (
		<Tag className="my-1">
			<div className="d-flex align-items-center">
				<Badge color={getLabelsColor(value)} />
				<span className="mx-1">{value}</span>
			</div>
		</Tag>
  );
}



  const submitComment = () => {
    const message = commentInput.current.input.value;
    commentInput.current.input.value = '';

    const newColumns = { ...columns };
    let newComment = createCommentObject();
    newComment.message = message;
    
    const updatedCards = newColumns[listId].map(elm => {
      if(elm.id === cardData.id) {
        return {
          ...elm,
          comments: [...elm.comments, newComment]
        };
      }
      return elm;
    });
    
    newColumns[listId] = updatedCards;
    dispatch(updateColumns(newColumns));
  };

  return (
    <Form 
      name="edit-card-ref" 
      layout="vertical" 
      onFinish={submitUpdate} 
      initialValues={initialValues}
    >
      <Form.Item name="name" className="mb-0">
        <Input className="board-card-modal input"/>
      </Form.Item>
      <Form.Item className="mb-3">
        <p>Board: <span className="font-weight-semibold">{listId}</span></p>
      </Form.Item>
      <Form.Item 
        label="Assigned to" 
        name="members" 
        className="blockform-col col-3"
      >
        <Select 
          filterOption={false} 
          tagRender={memberTagRender} 
          mode="tags" 
          removeIcon={null}
          placeholder="None"
          className="board-card-modal select"
        >
          {memberIds.map(elm => (
            <Select.Option key={elm} value={elm}>
              <AssigneeAvatar id={elm} name/>
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item 
        label="Due Date" 
        name="dueDate" 
        className="blockform-col col-3"
      >
        <DatePicker 
          placeholder="Due date unset" 
          className="board-card-modal date-picker w-100" 
          format={DATE_FORMAT_DD_MM_YYYY} 
        />
      </Form.Item>
      <Form.Item 
        label="Labels" 
        name="labels" 
        className="blockform-col col-3"
      >
        <Select 
          filterOption={false} 
          tagRender={labelTagRender} 
          mode="tags" 
          removeIcon={null}
          placeholder="None"
          className="board-card-modal select"
        >
          {labels.map(elm => (
            <Select.Option key={elm.label} value={elm.label}>
              <div className="d-flex align-items-center">
                <Badge color={getLabelsColor(elm.label)} />
                <span className="mx-2">{elm.label}</span>
              </div>
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Divider className="mt-0"/>
      <div className="d-flex">
        <div className="mr-3 font-size-md">
          <FileTextOutlined />	
        </div>
        <div className="w-100">
          <h4>Description</h4>
          <Form.Item name="description">
            <Input.TextArea className="board-card-modal text-area"/>
          </Form.Item>
        </div>
      </div>
      {attachmentsList?.length > 0 && (
        <div className="d-flex">
          <div className="mr-3 font-size-md">
            <PaperClipOutlined />
          </div>
          <div className="w-100">
            <h4>Attachments</h4>
            <Card.Grid hoverable={false} className="p-3">
              {attachmentsList.map(attachment => (
                <div key={attachment.id} className="mb-3">
                  <img 
                    src={attachment.src} 
                    alt={attachment.name} 
                    className="img-fluid mb-2" 
                  />
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="mb-0">{attachment.name}</h5>
                      <span className="text-muted">{attachment.size}</span>
                    </div>
                    <div className="d-flex align-items-center">
                      {cover === attachment.src && (
                        <StarFilled className="text-warning mr-2" />
                      )}
                      <Dropdown
                        menu={{
                          items: [
                            {
                              key: 'cover',
                              label: (
                                <span onClick={() => onCoverChange(attachment.id)}>
                                  <StarOutlined />
                                  <span className="ml-2">Set Cover</span>
                                </span>
                              ),
                            },
                            {
                              key: 'remove',
                              label: (
                                <span onClick={removeCover}>
                                  <DeleteOutlined />
                                  <span className="ml-2">Remove</span>
                                </span>
                              ),
                            },
                          ],
                        }}
                        trigger={['click']}
                      >
                        <EllipsisOutlined 
                          className="font-size-lg" 
                          style={{ transform: 'rotate(90deg)' }}
                        />
                      </Dropdown>
                    </div>
                  </div>
                </div>
              ))}
            </Card.Grid>
          </div>
        </div>
      )}
      <div className="d-flex">
        <div className="mr-3 font-size-md">
          <CommentOutlined />
        </div>
        <div className="w-100">
          <h4 className="mb-3">Comments ({commentsList.length})</h4>
          {commentsList.map(comment => (
            <div className="mb-3 d-flex" key={comment.id}>
              <Avatar src={comment.src} />
              <Card className="ml-2 w-100">
                <div className="d-flex align-items-center mb-2">
                  <h4 className="mb-0">{comment.name}</h4>
                  <span className="mx-1">|</span>
                  <span className="text-muted">
                    {dayjs(comment.date).format('DD MMMM YYYY')}
                  </span>
                </div>
                <p className="mb-0">{comment.message}</p>
              </Card>
            </div>
          ))}
          <div className="mb-3 d-flex">
            <Avatar src="/img/avatars/thumb-1.jpg"/>
            <Card className="ml-2 w-100">
              <Input
                ref={commentInput}
                placeholder="Write comment"
                suffix={
                  <span 
                    onClick={submitComment}
                    className="cursor-pointer font-weight-semibold text-primary"
                  >
                    Send
                  </span>
                }
              />
            </Card>
          </div>
        </div>
      </div>
      <Form.Item className="text-right mb-0">
        <Button type="primary" htmlType="submit">Change</Button>
      </Form.Item>
    </Form>
  );
};

const AddBoardForm = ({ onSubmit }) => {
  return (
    <Form layout="inline" name="add-board-ref" onFinish={onSubmit}>
      <Form.Item 
        name="boardTitle" 
        label="Board Title"
        rules={[
          {
            validator: (_, value) => {
              if (scrumboardData[value]) {
                return Promise.reject('Board already exists!');
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <Input autoComplete="off" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">Add</Button>
      </Form.Item>
    </Form>
  );
};

const ModalForm = ({ open, modalMode, cardData, listId, onClose, onModalSubmit }) => {
  const showClosable = modalMode !== modalModeTypes(1);
  const modalWidth = modalMode === modalModeTypes(1) ? 800 : 425;

  const submit = (values, mode) => {
    onModalSubmit(values, mode);
    onClose();
  };

  const getModalTitle = type => {
	switch (type) {
	  case modalModeTypes(0):
		return 'New Card';
	  case modalModeTypes(1):
		return 'Edit Card';
	  case modalModeTypes(2):
		return 'New Board';
	  default:
		return '';
	}
  }; 

  return (
    <Modal
      title={getModalTitle(modalMode)}
      open={open}
      closable={showClosable}
      footer={null}
      width={modalWidth}
      style={modalMode === modalModeTypes(1) ? {top: 20} : null}
      destroyOnClose
      onCancel={onClose}
    >
      <div 
        style={
          modalMode === modalModeTypes(1) 
            ? {maxHeight: '85vh', overflowY: 'auto', overflowX: 'hidden'} 
            : null
        }
      >
        <div className={modalMode === modalModeTypes(1) ? 'mr-2 ml-2' : null}>
          {(() => {
            switch(modalMode) {
              case modalModeTypes(0):
                return (
                  <AddCardForm 
                    onSubmit={values => submit(values, modalModeTypes(0))}
                  />
                );
              case modalModeTypes(1):
                return (
                  <UpdateCardForm 
                    cardData={cardData} 
                    listId={listId} 
                    onSubmit={values => submit(values, modalModeTypes(1))}
                  />
                );
              case modalModeTypes(2):
                return (
                  <AddBoardForm 
                    onSubmit={values => submit(values, modalModeTypes(2))}
                  />
                );
              default:
                return null;
            }
          })()}
        </div>
      </div>
    </Modal>
  );
};

export default ModalForm;



// import React, { useState, useEffect, useContext, useRef } from 'react'
// import { 
// 	Modal, 
// 	Form, 
// 	Input, 
// 	Button, 
// 	Select, 
// 	DatePicker, 
// 	Tag, 
// 	Badge, 
// 	Divider, 
// 	Card, 
// 	Row, 
// 	Col, 
// 	Menu, 
// 	Dropdown,
// 	Avatar 
// } from 'antd';
// import { 
// 	FileTextOutlined, 
// 	PaperClipOutlined, 
// 	EllipsisOutlined, 
// 	StarOutlined, 
// 	DeleteOutlined, 
// 	StarFilled, 
// 	CommentOutlined 
// } from '@ant-design/icons';
// import { modalModeTypes, AssigneeAvatar, getLabelsColor, getCover, createCommentObject } from './utils';
// import { DATE_FORMAT_DD_MM_YYYY } from 'constants/DateConstant';
// import { scrumboardData, memberIds, labels } from './ScrumboardData';
// import dayjs from 'dayjs';
// import { ScrumboardContext } from './ScrumboardContext'

// const { Option } = Select;

// const memberTagRender = (props) => <AssigneeAvatar id={props.value} size={25} />

// function labelTagRender(props) {
//   const { value } = props;
//   return (
// 		<Tag className="my-1">
// 			<div className="d-flex align-items-center">
// 				<Badge color={getLabelsColor(value)} />
// 				<span className="mx-1">{value}</span>
// 			</div>
// 		</Tag>
//   );
// }

// const getModalTitle = type => {
// 	switch (type) {
// 		case modalModeTypes(0):
// 			return 'New card';
// 		case modalModeTypes(2):
// 			return 'New board';
// 		default:
// 			return;
// 	}
// } 

// const AddCardForm = ({onSubmit}) => {
// 	return (
// 		<Form layout="inline" name="add-card-ref" onFinish={onSubmit}>
// 			<Form.Item name="cardTitle" label="Card Title">
// 				<Input autoComplete="off" />
// 			</Form.Item>
// 			<Form.Item>
// 				<Button type="primary" htmlType="submit">Add</Button>
// 			</Form.Item>
// 		</Form>
// 	)
// }

// const UpdateCardForm = ({onSubmit, cardData, listId}) => {
// 	const context = useContext(ScrumboardContext)

// 	const [attachmentsList, setAttachmentsList] = useState(cardData.attachments)
// 	const [commentsList, setCommentsList] = useState(cardData.comments)
// 	const [cover, setCover] = useState(cardData.cover)

// 	const commentInput = useRef();

// 	useEffect(() => {
// 		setAttachmentsList(cardData.attachments);
// 		setCommentsList(cardData.comments);
// 		setCover(cardData.cover)
// 	}, [cardData.attachments, cardData.comments, cardData.cover]);

// 	const initialValues = {
// 		name: cardData?.name,
// 		members: cardData?.members,
// 		dueDate: cardData?.dueDate ? dayjs(cardData.dueDate) : '',
// 		labels: cardData?.labels,
// 		description: cardData?.description,
// 	}

// 	const onCoverChange = id => {
// 		const updatedCover = getCover(id, attachmentsList)
// 		updateAttachment(updatedCover)
// 	}

// 	const submitUpdate = values => {
// 		let updatedValue = values
// 		updatedValue.attachments = attachmentsList
// 		updatedValue.comments = commentsList
// 		updatedValue.cover = cover
// 		updatedValue.id = cardData.id
// 		onSubmit(updatedValue)
// 	}

// 	const updateAttachment = (updatedCover) => {
// 		const data = context.columns
//     const updatadedCards = data[listId].map(elm => {
//       if(elm.id === cardData.id) {
//         elm.attachments = attachmentsList;
//         elm.cover = updatedCover
//       }
//       return elm
//     })
// 		data[listId] = updatadedCards
// 		context.updateColumns(data)
// 		context.updateOrdered(Object.keys(data))
// 	}

// 	const removeCover = () => {
// 		updateAttachment('')
// 	}

// 	const submitComment = () => {
// 		const message = commentInput.current.input.value
// 		commentInput.current.input.value = ''

// 		const { currentListId, columns, updateColumns, updateOrdered } = context
// 		const data = columns;
// 		let newComment = createCommentObject()
// 		newComment.message = message;
// 		const updatedComment = data[currentListId].map(elm => {
// 			if(elm.id === cardData.id) {
// 				elm.comments = [...elm.comments, ...[newComment]];
// 			}
//       		return elm
// 		})
		
// 		data[currentListId] = updatedComment
// 		updateColumns(data)
// 		updateOrdered(Object.keys(data))
// 	}

// 	return (
// 		<Form name="edit-card-ref" layout="vertical" onFinish={submitUpdate} initialValues={initialValues}>
// 			<Form.Item name="name" className="mb-0">
// 				<Input className="board-card-modal input"/>
// 			</Form.Item>
// 			<Form.Item className="mb-3">
// 				<p>Board: <span className="font-weight-semibold">{listId}</span></p>
// 			</Form.Item>
// 			<Form.Item label="Assigned to" name="members" className="blockform-col col-3">
// 				<Select 
// 					filterOption={false} 
// 					tagRender={memberTagRender} 
// 					mode="tags" 
// 					removeIcon={null}
// 					placeholder="None"
// 					className="board-card-modal select"
// 				>
// 					{
// 						memberIds.map(elm => (
// 							<Option key={elm} value={elm}>
// 								<AssigneeAvatar id={elm} name/>
// 							</Option>
// 						))
// 					}
// 				</Select>
// 			</Form.Item>
// 			<Form.Item label="Due Date" name="dueDate" className="blockform-col col-3">
// 				<DatePicker placeholder="Due date unset" className="board-card-modal date-picker w-100" format={DATE_FORMAT_DD_MM_YYYY} />
// 			</Form.Item>
// 			<Form.Item label="Labels" name="labels" className="blockform-col col-3">
// 				<Select 
// 					filterOption={false} 
// 					tagRender={labelTagRender} 
// 					mode="tags" 
// 					removeIcon={null}
// 					placeholder="None"
// 					className="board-card-modal select"
// 				>
// 					{
// 						labels.map(elm => (
// 							<Option key={elm.label} value={elm.label}>
// 								<div className="d-flex align-items-center">
// 									<Badge color={getLabelsColor(elm.label)} />
// 									<span className="mx-2">{elm.label}</span>
// 								</div>
// 							</Option>
// 						))
// 					}
// 				</Select>
// 			</Form.Item>
// 			<Divider className="mt-0"/>
// 			<div className="d-flex">
// 				<div className="mr-3 font-size-md">
// 					<FileTextOutlined />	
// 				</div>
// 				<div className="w-100">
// 					<h4>Description</h4>
// 					<Form.Item name="description">
// 						<Input.TextArea className="board-card-modal text-area"/>
// 					</Form.Item>
// 				</div>
// 			</div>
// 			{
// 				attachmentsList?.length > 0? 
// 				<div className="d-flex">
// 					<div className="mr-3 font-size-md">
// 						<PaperClipOutlined />
// 					</div>
// 					<div className="w-100">
// 						<h4>Attachments</h4>
// 						<Row gutter={16}>
// 							{
// 								attachmentsList?.map(elm => (
// 									<Col sm={24} md={8} key={elm.id}>
// 										<Card
// 											bodyStyle={{padding: 0}}
// 											cover={
// 												<div className="p-2">
// 													<img className="img-fluid" alt="example" src={elm.src} />
// 												</div>
// 											}
// 										>
// 											<div className="px-2 pb-2 d-flex align-items-center justify-content-between">
// 												<div>
// 													<h5 className="mb-0">{elm.name}</h5>
// 													<span className="text-muted font-size-sm">{elm.size}</span>
// 												</div>
// 												<div className="d-flex">
// 													{
// 														cover === elm.src ? <div className="mr-2 text-warning font-size-md"><StarFilled /></div> : null
// 													}
// 													<Dropdown 
// 														placement="bottomRight"
// 														menu={{
// 															items: [
// 																{
// 																	key: '0',
// 																	label: (
// 																		<span onClick={() => onCoverChange(elm.id)}>
// 																			<StarOutlined />
// 																			<span className="ml-2">Set Cover</span>
// 																		</span>
// 																	),
// 																},
// 																{
// 																	key: '1',
// 																	label: (
// 																		<span onClick={() => removeCover()}>
// 																			<DeleteOutlined />
// 																			<span className="ml-2">Remove</span>
// 																		</span>
// 																	),
// 																},
// 															]
// 														}}
// 														trigger={['click']}>
// 														<a className="font-size-md text-gray" href="/#" onClick={e => e.preventDefault()}>
// 															<EllipsisOutlined style={{transform: 'rotate(90deg)'}}/>
// 														</a>
// 													</Dropdown>
// 												</div>
// 											</div>
// 										</Card>
// 									</Col>
// 								))
// 							}
// 						</Row>
// 					</div>
// 				</div>
// 				:
// 				null
// 			}
// 			<div className="d-flex">
// 				<div className="mr-3 font-size-md">
// 					<CommentOutlined />
// 				</div>
// 				<div className="w-100">
// 					<h4 className="mb-3">Comments ({commentsList.length})</h4>
// 					{
// 						cardData?.comments.length > 0 && commentsList.map(elm => 
// 							<div className="mb-3 d-flex" key={elm.id}>
// 								<div className="mt-2">
// 									<Avatar src={elm.src}/>
// 								</div>
// 								<Card className="ml-2 w-100">
// 									<div className="d-flex align-items-center mb-2">
// 										<h4 className="mb-0">{elm.name}</h4>
// 										<span className="mx-1"> | </span>
// 										<span className="font-size-sm text-dark">{dayjs(elm.date).format('DD MMMM YYYY')}</span>
// 									</div>
// 									<p className="mb-0">{elm.message}</p>
// 								</Card>
// 							</div>
// 						)
// 					}
// 					<div className="mb-3 d-flex">
// 						<Avatar src="/img/avatars/thumb-1.jpg"/>
// 						<Card className="ml-2 w-100">
// 							<Input
// 								ref={commentInput}
// 								placeholder="Write comment"
// 								suffix={
// 									<div 
// 										onClick={submitComment} 
// 										className="cursor-pointer font-weight-semibold text-primary">
// 										Send
// 									</div>
// 								}
// 							/>
// 						</Card>
// 					</div>
// 				</div>
// 			</div>
// 			<Form.Item className="text-right mb-0">
// 				<Button type="primary" htmlType="submit">Change</Button>
// 			</Form.Item>
// 		</Form>
// 	)	
// }

// const AddBoardForm = ({onSubmit}) => {
// 	return(
// 		<Form layout="inline" name="add-board-ref" onFinish={onSubmit}>
// 			<Form.Item 
// 				name="boardTitle" 
// 				label="Board Title"
// 				rules={[() => ({
// 						validator(rule, value) {
// 							if(scrumboardData[value]) {
// 								return Promise.reject('Board already exist!');
// 							}
// 							return Promise.resolve();
// 						},
// 					}),
// 				]}
// 			>
// 				<Input autoComplete="off" />
// 			</Form.Item>
// 			<Form.Item>
// 				<Button type="primary" htmlType="submit">Add</Button>
// 			</Form.Item>
// 		</Form>
// 	)
// }

// const ModalForm = ({ open, modalMode, cardData, listId, onClose, onModalSubmit }) => {

// 	const showClosable = modalMode === modalModeTypes(1) ? false : true
// 	const modalWidth = modalMode === modalModeTypes(1) ? 800 : 425;

// 	const submit = (values, mode) => {
// 		onModalSubmit(values, mode)
// 		onClose()
// 	};

// 	return (
// 		<Modal
// 			title={getModalTitle(modalMode)}
// 			open={open}
// 			closable={showClosable}
// 			footer={null}
// 			width={modalWidth}
// 			style={modalMode === modalModeTypes(1)? {top: 20} : null}
// 			destroyOnClose
// 			onCancel={() => onClose()}
// 		>
// 			<div style={modalMode === modalModeTypes(1)? {maxHeight: '85vh', overflowY: 'auto', overflowX: 'hidden'} : null}>
// 				<div className={modalMode === modalModeTypes(1)? 'mr-2 ml-2' : null}>
// 					{ 
// 						(() => {
// 							switch(modalMode) {
// 								case modalModeTypes(0):
// 									return <AddCardForm onSubmit={values => submit(values, modalModeTypes(0))}/>;
// 								case modalModeTypes(1):
// 									return (
// 										<UpdateCardForm 
// 											cardData={cardData} 
// 											listId={listId} 
// 											onSubmit={values => submit(values, modalModeTypes(1))}
// 										/>
// 									);
// 								case modalModeTypes(2):
// 									return <AddBoardForm onSubmit={values => submit(values, modalModeTypes(2))}/>;
// 								default:
// 									return null;
// 							}
// 						})()
// 					}
// 				</div>
// 			</div>
// 		</Modal>
// 	)
// }

// export default ModalForm
