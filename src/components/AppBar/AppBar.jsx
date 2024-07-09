import AppsIcon from '@mui/icons-material/Apps'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import SvgIcon from '@mui/material/SvgIcon'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import ModeSelect from '~/components/ModeSelect'
import WorkSpaces from './Menu/WorkSpaces'
import Recent from './Menu/Recent'
import Starred from './Menu/Starred'
import { Avatar, Badge, Button, TextField, Tooltip } from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Profiles from './Menu/Profiles'
import Templates from './Menu/Templates'

export default function AppBar() {
  return (
    <Box
      sx={{
        // backgroundColor: 'primary.light',
        width: '100%',
        height: (theme) => theme.trello.appBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
      px={2}
    >
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AppsIcon sx={{ color: 'primary.main' }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <SvgIcon fontSize={'small'} component={TrelloIcon} inheritViewBox />
            <Typography
              sx={{
                fontWeight: 'bold',
                fontSize: '1.2rem',
                color: 'primary.main'
              }}
              variant="span"
            >
              Trello
            </Typography>
            <WorkSpaces />
            <Recent />
            <Starred />
            <Templates />
            <Button variant="outlined">Create</Button>
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          id="filled-search"
          label="Search..."
          type="search"
          size="small"
        />
        <ModeSelect />
        <Tooltip title="Notifications">
          <Badge variant="dot" color="secondary" sx={{ cursor: 'pointer' }}>
            <NotificationsNoneIcon sx={{ color: 'primary.main' }} />
          </Badge>
        </Tooltip>
        <Tooltip title="Help">
          <HelpOutlineIcon sx={{ cursor: 'pointer', color: 'primary.main' }} />
        </Tooltip>
        <Profiles />
      </Box>
    </Box>
  )
}
