import * as React from 'react'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import EditUserSettingTab from './EditUserSettingTab'
import EditUserSecurityTab from './EditUserSecurityTab'

export default function LabTabs ({ userId, userData, onUpdate }) {
  const [value, setValue] = React.useState('1')

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: '100%', typography: 'body1' }} className='edit-user-tabs'>
      <div className='general-tabs-container'>
        <form>
          <TabContext value={value}>
            <TabList onChange={handleChange} aria-label='lab API tabs example'>
              <Tab label='Settings' value='1' />
              <Tab label='Security' value='2' />
            </TabList>
            <TabPanel value='1'>
              <EditUserSettingTab
                userId={userId}
                userData={userData}
                onUpdateSuccess={() => onUpdate({}, () => {})}
              />
            </TabPanel>
            <TabPanel value='2'>
              <EditUserSecurityTab
                userId={userId}
                userData={userData}
                onUpdate={onUpdate}
              />
            </TabPanel>
          </TabContext>
        </form>
      </div>
    </Box>
  )
}
