import React, { forwardRef } from 'react';
import { Menu } from 'antd';

const SafeMenuItem = forwardRef((props, ref) => {
    return (
        <Menu.Item {...props} ref={ref}>
            {props.children}
        </Menu.Item>
    );
});

SafeMenuItem.displayName = 'SafeMenuItem';

export default SafeMenuItem; 