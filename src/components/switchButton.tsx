import React from 'react';
import { SwitchButtonItem } from '../Interfaces/shared/switchButtonItem';
import '../assets/styles/shared/switchButton.css';

const SwitchButton: React.FC<{ switchProps: SwitchButtonItem }> = ({ switchProps }) => {

    return (<>
        <div className='nameButton'>
            <label>{switchProps.label}</label>
        </div>

        <div className="switch-container">
            <label className="switch">
                <input type="checkbox" checked={switchProps.checked} onChange={switchProps.handleChange} />
                <span className="slider"></span>
            </label>
        </div>
    </>
    );
};

export default SwitchButton;
