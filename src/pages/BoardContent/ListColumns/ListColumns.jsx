import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Column from './Column/Column'
import { NoteAdd } from '@mui/icons-material'

function ListColumns({ columns }) {
  return (
    <>
      {columns.map((column) => (
        <Column key={column._id} column={column} />
      ))}
      {/* Box add new column */}
      <Box
        sx={{
          minWidth: '200px',
          maxWidth: '200px',
          height: 'fit-content',
          mx: 2,
          bgcolor: '#ffffff3D',
          borderRadius: '6px'
        }}
      >
        <Button
          sx={{
            color: 'white',
            justifyContent: 'flex-start',
            width: '100%',
            px: 2.5,
            py: 1
          }}
          startIcon={<NoteAdd />}
        >
          Add new column
        </Button>
      </Box>
    </>
  )
}

export default ListColumns
