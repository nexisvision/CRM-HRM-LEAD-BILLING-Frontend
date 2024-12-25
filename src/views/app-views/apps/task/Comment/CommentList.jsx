import React, { useState } from 'react';
import { Form } from 'antd';
import { CommentOutlined, PlusCircleOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';

const CommentList = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="flex flex-col items-start">
            {/* Add Comment Button */}
            <div className="flex items-center w-full">
                <button
                    className="flex items-center cursor-pointer"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="text-base font-medium text-blue-500 flex items-center gap-2">
                        <PlusCircleOutlined />
                        Add Comment
                    </div>
                </button>
            </div>

            {/* Comment Input Form */}
            {isExpanded && (
                <div className="mt-4 w-full">
                    <Form.Item name="comment">
                        <div className="flex gap-6">
                            <div>
                                <img
                                    src="https://demo-saas.worksuite.biz/img/gravatar.png"
                                    alt="User"
                                    className="w-8 h-8 rounded-sm"
                                />
                            </div>
                            <div className="flex-1">
                                <ReactQuill placeholder="Enter Notes" className="mt-2 w-full" />
                            </div>
                        </div>
                        <div className="flex gap-5 justify-end mt-5">
                            <button className="p-2 border border-gray-300 rounded-lg">Cancel</button>
                            <button
                                type="submit"
                                className="py-2 px-4 bg-red-600 rounded-lg text-white"
                            >
                                Submit
                            </button>
                        </div>
                    </Form.Item>
                </div>
            )}

            {/* No Comment Section */}
            {!isExpanded && (
                <div className="flex flex-col items-center w-full mt-4">
                    <CommentOutlined className="text-lg mb-2" />
                    <p className="text-center text-gray-500">- No comment found. -</p>
                </div>
            )}
        </div>
    );
};

export default CommentList;
