import React, { Component } from 'react'
import { Upload, Button } from 'antd';
import { UploadOutlined, StarOutlined } from '@ant-design/icons';

const props = {
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  onChange({ file, fileList }) {
    if (file.status !== 'uploading') {
    }
  },
  defaultFileList: [
    {
      uid: '1',
      name: 'xxx.png',
      status: 'done',
      response: 'Server Error 500', // custom error message to show
      url: 'http://www.baidu.com/xxx.png',
    },
    {
      uid: '2',
      name: 'yyy.png',
      status: 'done',
      url: 'http://www.baidu.com/yyy.png',
    },
    {
      uid: '3',
      name: 'zzz.png',
      status: 'error',
      response: 'Server Error 500', // custom error message to show
      url: 'http://www.baidu.com/zzz.png',
    },
  ],
  showUploadList: {
    showDownloadIcon: true,
    downloadIcon: 'download ',
    showRemoveIcon: true,
    removeIcon: <StarOutlined onClick={e => console.log(e, 'custom removeIcon event')} />,
  },
};

export class UploadCustomActionIcon extends Component {
	render() {
		return (
			<Upload {...props}>
				<Button>
					<UploadOutlined /> Upload
				</Button>
			</Upload>
		)
	}
}

export default UploadCustomActionIcon
