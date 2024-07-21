import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Column from './Column/Column'
import { NoteAdd } from '@mui/icons-material'

import {
  SortableContext,
  horizontalListSortingStrategy
} from '@dnd-kit/sortable'

function ListColumns({ columns }) {
  /**
   * Thằng SorttableContext yêu cầu items là một mảng dạng ['id-1','id-2',...] chứ không phải là [{id:'id-1'},{id:'id-2'}]
   * Nếu không đúng thì vẫn kéo thả được nhưng không có animation
   * https://github.com/clauderic/dnd-kit/issues/183
   */

  return (
    <SortableContext
      items={columns?.map((c) => c._id)}
      strategy={horizontalListSortingStrategy}
    >
      <Box
        sx={{
          bgcolor: 'inherit',
          width: '100%',
          height: '100%',
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          '&::-webkit-scrollbar-track  ': {
            m: 2
          }
        }}
      >
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
      </Box>
    </SortableContext>
  )
}

export default ListColumns
