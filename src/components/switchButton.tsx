import React from 'react';
import { SwitchButtonItem } from '../Interfaces/shared/switchButtonItem';
import '../assets/styles/shared/switchButton.css';

const SwitchButton: React.FC<{ switchProps: SwitchButtonItem }> = ({ switchProps }) => {

    return (<>
        <div className='nameButton'>
            <label>{switchProps.label}</label>
        </div>

        <div className={`erroSession_${switchProps.erroSession ?? switchProps.name ?? ''}`}></div>
        <div className="switch-container" data-name={switchProps.name}>
            <label className="switch">
                <input
                    id={switchProps.name}
                    name={switchProps.name}
                    type="checkbox"
                    checked={switchProps.checked}
                    onChange={switchProps.handleChange}
                />
                <span className="slider"></span>
            </label>
        </div>
    </>
    );
};

export default SwitchButton;
