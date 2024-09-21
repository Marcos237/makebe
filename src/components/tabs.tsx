import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { TabsItens } from '../Interfaces/Tabs/tabsItem';

const GenericTabs: React.FC<{ tabsProps: TabsItens[] }> = ({ tabsProps }) => {
    const [currentTab, setCurrentTab] = useState(0);


    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setCurrentTab(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
                <Box sx={{ width: '100%', bgcolor: 'background.paper'  }}>
                <Tabs value={currentTab} onChange={handleChange} centered>
                    {tabsProps.map((tab, index) => (
                        <Tab key={index} label={tab.label} />
                    ))}
                </Tabs>
            </Box>
            <Box mt={2}>
                {tabsProps[currentTab]?.content}
            </Box>
        </Box>
    );
};

export default GenericTabs;