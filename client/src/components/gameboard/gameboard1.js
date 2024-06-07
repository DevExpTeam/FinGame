import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile, deleteAccount } from '../../actions/profile';

const initialItems = {
  account: [
    { id: 'item1', content: 'Accounts Payable' },
    { id: 'item2', content: 'Furniture & Fixtures' },
    { id: 'item3', content: 'Allowance of Bad Debts' },
    { id: 'item4', content: "Owner's Investment" },
  ],
  currentAssets: [],
  propertyPlantEquipment: [],
  intangibleOrFinancialAssets: [],
  currentLiabilities: [],
  longTermLiabilities: [],
  accruals: [],
  capital: [],
};

const GameDashboard1 = ({
  getCurrentProfile,
  deleteAccount,
  auth: { user },
  profile: { profile, loading },
}) => {
  const [state, setState] = useState(initialItems);

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    const srcDroppableId = source.droppableId;
    const destDroppableId = destination.droppableId;
    const srcItems = [...state[srcDroppableId]];
    const destItems = destDroppableId === srcDroppableId ? srcItems : [...state[destDroppableId]];
    const [removed] = srcItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);

    setState({
      ...state,
      [srcDroppableId]: srcItems,
      [destDroppableId]: destItems,
    });
  };

  return (
    <div className="container mx-auto flex justify-between h-full py-10">
      <DragDropContext onDragEnd={handleDragEnd}>
        {Object.keys(state).map((droppableId, i) => (
          <Droppable key={droppableId} droppableId={droppableId}>
            {(provided, snapshot) => (
              <div className="flex flex-col items-center">
                <h2 className="mb-2 uppercase font-bold text-lg">{droppableId}</h2>
                <div ref={provided.innerRef} {...provided.droppableProps} className="border-2 border-gray-200 rounded w-64 min-h-3 p-2">
                  {state[droppableId].map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="border-2 border-gray-300 rounded my-1 p-2">
                          {item.content}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </div>
  );
}

GameDashboard1.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(
  GameDashboard1
);