import React from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';

const Spacer = ({horizontal = false, size}) => {
    const defaultValue = 'auto';

    return (
        <View
            style={{
                width: horizontal ? size : defaultValue,
                height: !horizontal ? size : defaultValue,
            }}
        />
    );
};

Spacer.propTypes = {
    size: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]).isRequired,
    horizontal: PropTypes.bool,
};

export default Spacer;