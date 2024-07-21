import Box from '@mui/material/Box'
import { mapOrder } from '~/utils/sorts'
import ListColumns from './ListColumns/ListColumns'

import {
  DndContext,
  // PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'
import { cloneDeep } from 'lodash'

import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}
function BoardContent({ board }) {
  // Require the mouse to move by 10 pixels before activating
  //Nếu dùng PointerSensor mặc định thì phải kết hợp thuộc tính css touch-action: none ở những phần từ kéo thả.-nhưng mà còn bug
  // const pointerSensor = useSensor(PointerSensor, {
  //   activationConstraint: { distance: 10 }
  // })
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 }
  })
  // Press delay of 250ms, with tolerance of 500px of movement
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 500
    }
  })
  // const sensors = useSensors(pointerSensor)
  //Ưu tiên sử dụng kết hợp 2 loại sensors là mouse và touch để có trải nghiệm trên mobile tốt nhất, không bị bug
  const sensors = useSensors(mouseSensor, touchSensor)
  const [orderedColumns, setOrderedColumns] = useState([])
  const [orderedCards, setOrderedCards] = useState([])

  //Cùng một thời điểm chỉ có một phần tử đang được kéo (column hoặc card)
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] =
    useState(null)

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])
  //tìm một Column theo CardId
  const findColumnByCardId = (cardId) => {
    // Nên dùng c.cards thay vì c.cardOderIds vì ở bước handleDragOver chúng ta sẽ làm dữ liệu cho cards hoàn chỉnh trước rồi mới tạo ra cardOrderIds mới
    return orderedColumns.find((column) =>
      column?.cards?.map((card) => card._id)?.includes(cardId)
    )
  }
  //trigger khi bắt đầu kéo(drag) một phần tử
  const handleDragStart = (e) => {
    // console.log('🚀 ~ handleDragStart ~ e:', e)
    setActiveDragItemId(e?.active?.id)
    setActiveDragItemType(
      e?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    )
    setActiveDragItemData(e?.active?.data?.current)

    // Nếu kéo Card thì mới thực hiện hành động set giá trị oldColumn
    if (e?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(e?.active?.id))
    }
  }
  //trong quá trình kéo một phần tử
  const handleDragOver = (event) => {
    // console.log(event)
    //không xử lí nếu kéo Column
    if (activeDragItemType == ACTIVE_DRAG_ITEM_TYPE.COLUMN) return
    //
    const { active, over } = event
    // Kiểm tra nếu không tồn tại active hoặc over (kéo ra ngoài container thì return luôn tránh lỗi)
    if (!active || !over) return

    //activeDraggingCard: là cái cảd đang được kéo
    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData }
    } = active
    // overCard: là cái card đang tương tác ở dưới so với cái card được kéo ở trên
    const { id: overCardId } = over
    //tìm 2 column của cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)
    //Nếu không tồn tại 1 trong 2 column thì không làm gì hết, tránh crash trang web
    if (!activeColumn || !overColumn) return

    // Xử lí logic ở đây chỉ khi kéo card qua 2 column khác nhau, còn nếu kéo card trong chính column ban đầu của nó thì không làm gì
    // Vì đây đang là đoạn xử lý lúc kéo (handleDragOver), còn xử lý lúc kéo xong thì nó ở trong (handleDragEnd)
    if (activeColumn._id !== overColumn._id) {
      setOrderedColumns((prevColumns) => {
        // Tìm index của overCard trong column đích(nơi mà activeCard sắp được thả)
        const overCardIndex = overColumn?.cards?.findIndex(
          (card) => card._id === overCardId
        )
        let newCardIndex
        const isBelowOverItem =
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height
        const modifier = isBelowOverItem ? 1 : 0
        newCardIndex =
          overCardIndex >= 0
            ? overCardIndex + modifier
            : overColumn?.cards?.length + 1
        // clone mảng orderedColumns cũ ra một cái mới để xử lý data rồi return - cập nhật lại orderedColumns mới
        const nextColumns = cloneDeep(prevColumns)
        const nextActiveColumn = nextColumns.find(
          (column) => column._id === activeColumn._id
        )
        // console.log(
        //   '🚀 ~ setOrderedColumns ~ nextActiveColumn:',
        //   nextActiveColumn
        // )
        const nextOverColumn = nextColumns.find(
          (column) => column._id === overColumn._id
        )
        // nextActiveColumn: Column cũ
        if (nextActiveColumn) {
          //Xóa card ở column active (column cũ)
          nextActiveColumn.cards = nextActiveColumn.cards.filter(
            (card) => card._id !== activeDraggingCardId
          )
          //Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
            (card) => card._id
          )
        }
        //nextOverColumn: column mới
        if (nextOverColumn) {
          // Kiểm tra xem card đang kéo nó có tồn tại ở overColumn chưa, nếu có thì cần xóa nó trước
          nextOverColumn.cards = nextOverColumn.cards.filter(
            (card) => card._id !== activeDraggingCardId
          )
          //Thêm card đang kéo vào overColumn teo vị trí index mới
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(
            newCardIndex,
            0,
            activeDraggingCardData
          )
          //Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
            (card) => card._id
          )
        }
        return nextColumns
      })
    }
  }
  //trigger khi bắt đầu thả(drop) một phần tử
  const handleDragEnd = (event) => {
    // console.log('🚀 ~ handleDragEnd ~ event:', event)
    const { active, over } = event
    // Kiểm tra nếu không tồn tại over (kéo ra ngoài thì return luôn tránh lỗi)
    if (!active || !over) return
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      //activeDraggingCard: là cái cảd đang được kéo
      const {
        id: activeDraggingCardId,
        data: { current: activeDraggingCardData }
      } = active
      // overCard: là cái card đang tương tác ở dưới so với cái card được kéo ở trên
      const { id: overCardId } = over
      //tìm 2 column của cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)
      //Nếu không tồn tại 1 trong 2 column thì không làm gì hết, tránh crash trang web
      if (!activeColumn || !overColumn) return
      // Dùng oldColumnWhenDraggingCard._id (set vào state từ bước handleDragStart) chứ không phải activeData trong scope handleDragEnd vì sau khi đi qua onDragOver thì state của card đã bị  cập nhật một lần rồi.
      //Kéo thả giữa card giữa 2 column khác nhau
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
      } else {
        //Kéo thả giữa card giữa 2 column giống nhau
        //lấy vị trí cũ từ thằng oldColumnWhenDraggingCard
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(
          (c) => c._id === activeDragItemId
        )
        //lấy vị trí mới từ thẳng over
        const newCardIndex = overColumn?.cards?.findIndex(
          (c) => c._id === overCardId
        )
        // Dùng arrayMove vì kéo card trong một cái column thì tương tự với logic kéo column trong boardContent
        const dndOrderedColumns = arrayMove(
          oldColumnWhenDraggingCard?.cards,
          oldCardIndex,
          newCardIndex
        )
        setOrderedColumns((prevColumns) => {
          // clone mảng orderedColumns cũ ra một cái mới để xử lý data rồi return - cập nhật lại orderedColumns mới
          const nextColumns = cloneDeep(prevColumns)

          //Tìm tới column đang thả
          const targetColumn = nextColumns.find(
            (column) => column._id === overColumn._id
          )
          //cập nhật lại giá trj mới là card và cardOrderIds trong targetColumn
          targetColumn.cards = dndOrderedColumns
          targetColumn.cardOrderIds = dndOrderedColumns.map((card) => card._id)
          console.log(targetColumn)

          //Trả về giá trj state mới (chuẩn vị trí)
          return nextColumns
        })
      }
    }
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      console.log('Keo tha COLUMN')
      // Nếu vị trí sau khi kéo thả khác với vị trí ban đầu
      if (active.id !== over.id) {
        // console.log('keo tha')
        //lấy vị trí cũ từ thẳng active
        const oldColumnIndex = orderedColumns.findIndex(
          (c) => c._id === active.id
        )
        //lấy vị trí mới từ thẳng over
        const newColumnIndex = orderedColumns.findIndex(
          (c) => c._id === over.id
        )
        //Dùng arrayMove của dnd-kit để sắp xếp lại mảng Columns ban đầu
        // code của arrayMove :
        const dndOrderedColumns = arrayMove(
          orderedColumns,
          oldColumnIndex,
          newColumnIndex
        )
        // Đợi xử lí gọi API
        // const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)
        // console.log('🚀 ~ handleDragEnd ~ dndOrderedColumnsIds:', dndOrderedColumnsIds)
        // console.log('🚀 ~ handleDragEnd ~ dndOrderedColumns:', dndOrderedColumns)
        setOrderedColumns(dndOrderedColumns)
      }
    }
    // Những dữ liệu sau khi kéo thả phải đưa về giá trị null mặc định ban đầu
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }
  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    })
  }
  // console.log('🚀 ~ BoardContent ~ activeDragItemId:', activeDragItemId)
  // console.log('🚀 ~ BoardContent ~ activeDragItemType:', activeDragItemType)
  // console.log('🚀 ~ BoardContent ~ activeDragItemData:', activeDragItemData)

  return (
    <DndContext
      sensors={sensors}
      // Thuật toán phát hiện va chạm (nếu không có nó thì card với cover lớn sẽ không kéo qua Column được vì nó đang bị conflict giữa card với column), chung ta sẽ dùng closestCorners thay vì closestCenter
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? '#34495e' : '#1976d2',
          width: '100%',
          height: (theme) => theme.trello.boardContentHeight,
          p: '10px 0'
        }}
      >
        <ListColumns columns={orderedColumns} />
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
            <Column column={activeDragItemData} />
          )}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && (
            <Card card={activeDragItemData} />
          )}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
