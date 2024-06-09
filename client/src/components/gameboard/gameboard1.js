import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { getCurrentProfile, deleteAccount } from '../../actions/profile';

const initialItems = {
  account: [
    { id: 'item1', content: 'Accounts Payable', answer: 'currentLiabilities', tooltip: "This is a tooltip to describe the accounts" },
    { id: 'item2', content: 'Furniture & Fixtures', answer: 'propertyPlantEquipment', tooltip: "This is a tooltip to describe the accounts" },
    { id: 'item3', content: 'Allowance of Bad Debts', answer: 'propertyPlantEquipment', tooltip: "This is a tooltip to describe the accounts" },
    { id: 'item4', content: "Owner's Investment", answer: 'propertyPlantEquipment', tooltip: "This is a tooltip to describe the accounts" },
    { id: 'item5', content: 'Franchise Agreements', answer: 'propertyPlantEquipment', tooltip: "This is a tooltip to describe the accounts" },
    { id: 'item6', content: 'Joint Ventures', answer: 'propertyPlantEquipment', tooltip: "This is a tooltip to describe the accounts" },
    { id: 'item7', content: 'Virtual Certificates', answer: 'propertyPlantEquipment', tooltip: "This is a tooltip to describe the accounts" },
    { id: 'item8', content: "Customer Deposits", answer: 'propertyPlantEquipment', tooltip: "This is a tooltip to describe the accounts" },
    { id: 'item9', content: 'Gift Cards & Loyalty Points', answer: 'propertyPlantEquipment', tooltip: "This is a tooltip to describe the accounts" },
    { id: 'item10', content: 'Capitalized Research & Development', answer: 'propertyPlantEquipment', tooltip: "This is a tooltip to describe the accounts" },
  ],
  currentAssets: [],
  propertyPlantEquipment: [],
  intangibleAssets: [],
  financialAssets: [],
  digitalAssets: [],
  currentLiabilities: [],
  longTermLiabilities: [],
  accruals: [],
  capital: [],
};

const assetCategories = ["currentAssets", "propertyPlantEquipment", "intangibleAssets", "financialAssets", "digitalAssets"]
const liabilitiesCategories = ["currentLiabilities", "longTermLiabilities", "accruals", "capital"]

const categoryNames = {
  currentAssets: "Current Assets",
  propertyPlantEquipment: "Property, Plant & Equipment",
  intangibleAssets: "Intangible Assets",
  financialAssets: "Financial Assets",
  digitalAssets: "Digital Assets",
  currentLiabilities: "Current Liabilities",
  longTermLiabilities: "Long-Term Liabilities",
  accruals: "Accruals",
  capital: "Capital"
}

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
    <div className="mx-auto flex justify-between h-full py-10">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex flex-col items-center p-4 pt-7 rounded-lg">
          <h2 className="mb-4 uppercase font-bold text-xl text-gray-800">Account</h2>
          <div className="h-7" />
          <Droppable droppableId="account">
            {(provided, snapshot) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="border-2 border-gray-200 bg-white rounded-lg w-96 min-h-96 p-1 overflow-auto">
                {state.account.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <Tooltip title = {item.tooltip} arrow><div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="border-2 border-gray-300 bg-gray-100 rounded-lg m-1 p-1 shadow-md flex items-center justify-center h-12 font-sans">
                        {item.content}
                      </div></Tooltip>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
        <div className="flex flex-col items-center bg-blue-50 p-4 rounded-lg shadow-md">  
          <h2 className="mb-4 uppercase font-bold text-xl text-blue-800">Debt balance</h2>
          {assetCategories.map((droppableId) => (
            <Droppable key={droppableId} droppableId={droppableId}>
              {(provided, snapshot) => (
                <div className="flex flex-col items-center mt-4">
                  <h3 className="mb-2 font-bold text-md text-blue-600">{categoryNames[droppableId]}</h3>
                  <div ref={provided.innerRef} {...provided.droppableProps} className="border-2 border-blue-200 bg-white rounded-lg w-96 min-h-20 max-h-48 p-1 mb-4 shadow overflow-auto">
                    {state[droppableId].map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="border-2 border-gray-300 bg-gray-100 rounded-lg m-1 p-1 shadow-md flex items-center justify-center h-12 font-sans">
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
        </div>
        <div className="flex flex-col items-center bg-green-50 p-4 rounded-lg shadow-md">
          <h2 className="mb-4 uppercase font-bold text-xl text-green-800">Credit balance</h2>
          {liabilitiesCategories.map((droppableId) => (
            <Droppable key={droppableId} droppableId={droppableId}>
              {(provided, snapshot) => (
                <div className="flex flex-col items-center mt-4">
                  <h3 className="mb-2 font-bold text-md text-green-600">{categoryNames[droppableId]}</h3>
                  <div ref={provided.innerRef} {...provided.droppableProps} className="border-2 border-green-200 bg-white rounded-lg w-96 min-h-20 max-h-48 p-1 mb-4 shadow overflow-auto">
                    {state[droppableId].map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="border-2 border-gray-300 bg-gray-100 rounded-lg m-1 p-1 shadow-md flex items-center justify-center h-12 font-sans">
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
        </div>
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