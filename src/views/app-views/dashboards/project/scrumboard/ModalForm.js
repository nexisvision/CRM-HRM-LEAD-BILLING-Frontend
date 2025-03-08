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

