import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';
import startSound from '../../sound/start.mp3';
import rightSound from '../../sound/right.wav';
import wrongSound from '../../sound/wrong.mp3';
import bonusSound from '../../sound/bonus.wav';
import fireSound from '../../sound/fire.mp3';
import endSound from '../../sound/end.wav';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { getGame1 } from '../../actions/game1';
import ScoreboardItem from './ScoreboardItem';
import video0 from '../../video/0.webm';
import video3 from '../../video/3.webm';
import video4 from '../../video/4.webm';
import video5 from '../../video/5.webm';
import video6 from '../../video/6.webm';
import video7 from '../../video/7.webm';
import video8 from '../../video/8.webm';
import video9 from '../../video/9.webm';
import video10 from '../../video/10.webm';
import '../../index.css';

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
  auth: { user },
  getGame1,
  game1: { game1, loading },
}) => {

  const [source, setSource] = useState(0);          //used to keep the video source
  const [score, setScore] = useState(0);
  const [count, setCount] = useState(0);          //used to count the continuous success
  const [total, setTotal] = useState(0);          //used to count total success. If it reaches 10, game over
  const [boxes, setBoxes] = useState({
    account: game1,
    currentAssets: [],
    propertyPlantEquipment: [],
    intangibleAssets: [],
    financialAssets: [],
    digitalAssets: [],
    currentLiabilities: [],
    longTermLiabilities: [],
    accruals: [],
    capital: [],
  });

  const openFlame = (source) => {
    new Audio(fireSound).play();
    setSource(source);
    setTimeout(() => {
      setSource(false);
    }, 900);
  }

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    //get source and destination account item arrays
    const srcDroppableId = source.droppableId;
    const destDroppableId = destination.droppableId;
    const srcItems = [...boxes[srcDroppableId]];
    const destItems = destDroppableId === srcDroppableId ? srcItems : [...boxes[destDroppableId]];

    if(source.droppableId === destination.droppableId);   //move in the self box
    else if(source.droppableId !== "account")  return;   //go back to account box
    else if(srcItems[source.index].answer === destination.droppableId) {
      //success case
      if(total + 1 === 10) {
        //when it is final success
        openFlame(video10)
        setTimeout(() => {
          new Audio(endSound).play();
          //show msgbox
        }, 1000);
      }
      else if(count + 1 >= 3) {
        //when continuously success for more than 3 times
        switch (count + 1) {
          case 3:
            openFlame(video3)
            break;
          case 4:
            openFlame(video4)
            break;
          case 5:
            openFlame(video5)
            break;
          case 6:
            openFlame(video6)
            break;
          case 7:
            openFlame(video7)
            break;
          case 8:
            openFlame(video8)
            break;
          case 9:
            openFlame(video9)
            break;
          case 10:
            openFlame(video10)
            break;
          default:
            openFlame(video0)
            break;
        }
      }
      else if(count + 1 >= 2) {
        //when continuously success for more than 2 times
        new Audio(bonusSound).play();
      }
      else new Audio(rightSound).play();
      setCount(count + 1);
      setTotal(total + 1);
      setScore(score + 10 + count);
    }
    else {
      //wrong case
      new Audio(wrongSound).play();
      setCount(0);            //initialize count
      if(score < 2) setScore(0);
      else setScore(score - 2);
      return;
    }

    //move item to the destination
    const [removed] = srcItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);

    setBoxes({
      ...boxes,
      [srcDroppableId]: srcItems,
      [destDroppableId]: destItems,
    });
  };

  useEffect(() => {
    new Audio(startSound).play();
    getGame1();
  }, []);

  return (
    <div className="flex justify-between h-full py-10">
      {source ?
        <div className="fixed transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
          <video autoPlay loop muted className="w-96 h-96 grow">
            <source src={source} type="video/webm" />
          </video>
        </div>
      :
        <></>
      }
      {/* <button onClick={()=>{getGame1();setBoxes({
        account: game1,
        currentAssets: [],
        propertyPlantEquipment: [],
        intangibleAssets: [],
        financialAssets: [],
        digitalAssets: [],
        currentLiabilities: [],
        longTermLiabilities: [],
        accruals: [],
        capital: [],
      })}}>sdfsdf</button> */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex flex-col items-center p-4 pt-7 rounded-lg">
          <h2 className="mb-4 uppercase font-bold text-xl text-gray-800">Account</h2>
          <div className="h-7" />
          <Droppable droppableId="account">
            {(provided, snapshot) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="border-2 border-gray-200 bg-white rounded-lg w-96 min-h-96 p-1 overflow-y-auto">
                {boxes.account.map((item, index) => (
                  <Draggable key={item._id} draggableId={item._id} index={index}>
                    {(provided, snapshot) => (
                      <Tooltip title = {item.tooltip} arrow><div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="border-2 border-gray-300 bg-gray-100 rounded-lg m-1 p-1 shadow-md flex items-center justify-center h-12 font-sans font-semibold">
                        {item.name}
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
          <h2 className="mb-4 uppercase font-bold text-xl text-blue-800">Debit balance</h2>
          {assetCategories.map((droppableId) => (
            <Droppable key={droppableId} droppableId={droppableId}>
              {(provided, snapshot) => (
                <div className="flex flex-col items-center mt-4">
                  <h3 className="mb-2 font-bold text-md text-blue-600">{categoryNames[droppableId]}</h3>
                  <div ref={provided.innerRef} {...provided.droppableProps} className="border-2 border-blue-200 bg-white rounded-lg w-96 min-h-20 max-h-48 p-1 mb-4 shadow overflow-y-auto">
                    {boxes[droppableId].map((item, index) => (
                      <Draggable key={item._id} draggableId={item._id} index={index}>
                        {(provided, snapshot) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="border-2 border-gray-300 bg-gray-100 rounded-lg m-1 py-1 shadow-md flex items-center justify-center h-12 font-sans font-semibold">
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
          ))}
        </div>
        <div className="flex flex-col items-center bg-green-50 p-4 rounded-lg shadow-md">
          <h2 className="mb-4 uppercase font-bold text-xl text-green-800">Credit balance</h2>
          {liabilitiesCategories.map((droppableId) => (
            <Droppable key={droppableId} droppableId={droppableId}>
              {(provided, snapshot) => (
                <div className="flex flex-col items-center mt-4">
                  <h3 className="mb-2 font-bold text-md text-green-600">{categoryNames[droppableId]}</h3>
                  <div ref={provided.innerRef} {...provided.droppableProps} className="border-2 border-green-200 bg-white rounded-lg w-96 min-h-20 max-h-48 p-1 mb-4 shadow overflow-y-auto">
                    {boxes[droppableId].map((item, index) => (
                      <Draggable key={item._id} draggableId={item._id} index={index}>
                        {(provided, snapshot) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="border-2 border-gray-300 bg-gray-100 rounded-lg m-1 p-1 shadow-md flex items-center justify-center h-12 font-sans font-semibold">
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
          ))}
        </div>
        <div className="flex flex-col items-center pt-36 pl-5">
          <ScoreboardItem
            label="Max Score"
            value={100}
            bgColor="bg-purple-500"
            textColor="text-white"
          />
          <ScoreboardItem
            label="Average Score"
            value={80}
            bgColor="bg-yellow-500"
            textColor="text-white"
          />
          <ScoreboardItem
            label="Current Score"
            value={score}
            bgColor="bg-pink-500"
            textColor="text-white"
          />
        </div>
      </DragDropContext>
    </div>
  );
}

GameDashboard1.propTypes = {
  auth: PropTypes.object.isRequired,
  game1: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  game1: state.game1,
});

export default connect(mapStateToProps, { getGame1 })(
  GameDashboard1
);