import AppsIcon from '@mui/icons-material/Apps'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import {
  Badge,
  Button,
  InputAdornment,
  TextField,
  Tooltip
} from '@mui/material'
import Box from '@mui/material/Box'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import ModeSelect from '~/components/ModeSelect'
import Profiles from './Menu/Profiles'
import Recent from './Menu/Recent'
import Starred from './Menu/Starred'
import Templates from './Menu/Templates'
import WorkSpaces from './Menu/WorkSpaces'
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import { useState } from 'react'

export default function AppBar() {
  const [searchValue, setSearchValue] = useState('')

  return (
    <Box
      sx={{
        width: '100%',
        height: (theme) => theme.trello.appBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        paddingX: 2,
        overflowX: 'auto',
        bgcolor: (theme) =>
          theme.palette.mode === 'dark' ? '#2c3e50' : '#0a4598'
      }}
    >
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AppsIcon sx={{ color: 'white' }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <SvgIcon fontSize={'small'} component={TrelloIcon} inheritViewBox />
            <Typography
              sx={{
                fontWeight: 'bold',
                fontSize: '1.2rem',
                color: 'white'
              }}
              variant="span"
            >
              Trello
            </Typography>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              <WorkSpaces />
              <Recent />
              <Starred />
              <Templates />
              <Button sx={{ color: 'white' }} startIcon={<AddToPhotosIcon />}>
                Create
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          id="filled-search"
          label="Search..."
          type="text"
          size="small"
          sx={{
            minWidth: '120px',
            maxWidth: '200px',
            '& label': {
              color: 'white'
            },
            '& input': {
              color: 'white'
            },
            '& label.Mui-focused': {
              color: 'white'
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'white'
              },
              '&:hover fieldset': {
                borderColor: 'white'
              },
              '&.Mui-focused fieldset': {
                borderColor: 'white'
              }
            }
          }}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'white' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="start">
                <CloseIcon
                  onClick={() => setSearchValue('')}
                  sx={{
                    color: searchValue ? 'white' : 'transparent',
                    cursor: 'pointer'
                  }}
                />
              </InputAdornment>
            )
          }}
        />
        <ModeSelect />
        <Tooltip title="Notifications">
          <Badge variant="dot" color="warning" sx={{ cursor: 'pointer' }}>
            <NotificationsNoneIcon sx={{ color: 'white' }} />
          </Badge>
        </Tooltip>
        <Tooltip title="Help">
          <HelpOutlineIcon sx={{ cursor: 'pointer', color: 'white' }} />
        </Tooltip>
        <Profiles />
      </Box>
    </Box>
  )
}
