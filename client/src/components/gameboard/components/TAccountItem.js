import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import NumberInput from './NumberInput';

export default function TArrayItem({ TAccount, boxes, twinkle, onChange=()=>{} }) {
  return (
    <div className="mb-24">
      {boxes ? (      //boxes are used to check if the TArray is answer or input. If it is an answer, boxes is undefined
        <Droppable key={TAccount.boxName} droppableId={TAccount.boxName}>
          {(provided, snapshot) => (
            <div className="flex flex-col items-center">
              <div ref={provided.innerRef} {...provided.droppableProps} className={`border-2 bg-white rounded-lg w-72 h-8 mb-1 shadow ${boxes[TAccount.boxName]?.length === 0 && twinkle && "twinkle"}`}>
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
      ) : (
        <div className="border-2 border-gray-300 bg-gray-100 rounded-lg shadow-md text-center w-72 h-8 mx-auto font-sans font-semibold">
          {TAccount.name}
        </div>
      )}
      <Box sx={{ borderTop: 3, borderColor: 'black', width: '19rem', minHeight:'10rem', mt: 1, display: 'flex', flexDirection: 'row' }}>
        <Box sx={{ borderRight: 3, borderColor: 'black', pb: 1, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {TAccount.debit.map((val, index) =>
            <NumberInput value={val} disabled={!boxes} onChange={(e) => onChange(e.target.value, "debit", index)} />
          )}
        </Box>
        <Box sx={{ pb: 1, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {TAccount.credit.map((val, index) =>
            <NumberInput value={val} disabled={!boxes} onChange={(e) => onChange(e.target.value, "credit", index)} />
          )}
        </Box>
      </Box>
      <Box sx={{ borderTop: 1, borderBottom: 1, borderColor: 'black', width: '18rem', marginLeft: 1, display: 'flex', flexDirection: 'row' }}>
        <Box sx={{ borderRight: 3, borderColor: 'black', pb: 0.2, flex: 1 }}>
        </Box>
        <Box sx={{ flex: 1 }}>
        </Box>
      </Box>
      <Box sx={{ width: '19rem', display: 'flex', flexDirection: 'row' }}>
        <Box sx={{ borderRight: 3, borderColor: 'black', pb:1, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {TAccount.boxName.includes("debit") ? <NumberInput value={TAccount.total} disabled disabledBold /> : <></>}
        </Box>
        <Box sx={{ pb:1, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {TAccount.boxName.includes("credit") ? <NumberInput value={TAccount.total} disabled disabledBold /> : <></>}
        </Box>
      </Box>
    </div>
  );
}