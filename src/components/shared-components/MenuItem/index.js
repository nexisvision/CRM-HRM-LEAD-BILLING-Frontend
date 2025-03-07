import React, { useRef } from 'react';
import { Menu } from 'antd';

const MenuItem = React.forwardRef((props, ref) => {
    const itemRef = useRef(null);

    return (
        <Menu.Item {...props} ref={itemRef}>
            {props.children}
        </Menu.Item>
    );
});

MenuItem.displayName = 'MenuItem';

export default MenuItem; 