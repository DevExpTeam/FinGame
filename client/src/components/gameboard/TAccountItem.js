import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Droppable, Draggable } from 'react-beautiful-dnd';

export default function TArrayItem({ TAccount, boxes }) {
  return (
    <div>
      <Droppable key={TAccount.boxName} droppableId={TAccount.boxName}>
        {(provided, snapshot) => (
          <div className="flex flex-col items-center">
            <div ref={provided.innerRef} {...provided.droppableProps} className="border-2 border-green-200 bg-white rounded-lg w-72 h-8 mb-1 shadow">
              {boxes[TAccount.boxName]?.map((item, index) => (
                <Draggable key={item._id} draggableId={item._id} index={index}>
                  {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="border-2 border-gray-300 bg-gray-100 rounded-lg shadow-md flex items-center justify-center h-8 font-sans font-semibold">
                      {item.name}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
      <Box sx={{ borderTop: 3, borderColor: 'black', width: '18rem', mt: 1, pb: 2, display: 'flex', flexDirection: 'row' }}>
        <Box sx={{ borderRight: 3, borderColor: 'black', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <TextField size="small" sx={{ width: '8rem', bgcolor: 'white', mt: 1, zIndex: 0 }} />
        </Box>
        <Box sx={{ borderColor: 'divider', pb: 2, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <TextField size="small" sx={{ width: '8rem', bgcolor: 'white', mt: 1, zIndex: 0 }} />
        </Box>
      </Box>
    </div>
  );
}