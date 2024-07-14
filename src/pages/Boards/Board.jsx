import Container from '@mui/material/Container'
import AppBar from '../../components/AppBar'
import BoardContent from '../BoardContent'
import BoardBar from './BoardBar'
import { mockData } from '~/apis/mock-data'

export default function Board() {
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={mockData?.board} />
      <BoardContent board={mockData?.board} />
    </Container>
  )
}
