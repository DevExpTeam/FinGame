import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';
import Swal from "sweetalert2";
import startSound from '../../sound/start.mp3';
import rightSound from '../../sound/right.wav';
import wrongSound from '../../sound/wrong.mp3';
import bonusSound from '../../sound/bonus.wav';
import fireSound from '../../sound/fire.mp3';
import victorySound from '../../sound/victory.wav';
import endSound from '../../sound/end.mp3';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { getGame1 } from '../../actions/game';
import { getScores, addScores } from '../../actions/scores';
import { debitCategories, creditCategories, categoryNames } from './Constants';
import ScoreboardItem from './components/ScoreboardItem';
import video0 from '../../video/0.webm';
import video3 from '../../video/3.webm';
import video4 from '../../video/4.webm';
import video5 from '../../video/5.webm';
import video6 from '../../video/6.webm';
import video7 from '../../video/7.webm';
import video8 from '../../video/8.webm';
import video9 from '../../video/9.webm';
import video10 from '../../video/10.webm';

const GameDashboard1 = ({
  auth: { user },
  getGame1,
  getScores,
  addScores,
  scores: { scores, loading: scoreLoading },
  game1: { game1, loading: gameLoading },
}) => {

  const [source, setSource] = useState(0);          //used to keep the video source
  const [score, setScore] = useState(0);
  const [count, setCount] = useState(0);          //used to count the continuous success
  const [total, setTotal] = useState(0);          //used to count total success. If it reaches 10, game over
  const [boxes, setBoxes] = useState({});
  const [addition, setAddition] = useState({ value: 0, bonus: 0 });    //show addition to the score

  const openFlame = (source) => {
    new Audio(fireSound).play();
    setSource(source);
    setTimeout(() => {
      setSource(false);
    }, 900);
  }

  const openEndAlert = async () => {
    const result = await Swal.fire({
      title: score >= 80 ? "Congratulations!" : "Cheer up!",
      text: "Would you like to continue the game?\nYour bonus level will also carry over.",
      type: "success",
      confirmButtonText: "Yes",
      confirmButtonColor: "#2ECC71",
      showCancelButton: true,
      cancelButtonText: "No",
      cancelButtonColor: "#E74C3C",
      showCloseButton: true,
    });

    if (result.value) initialize();
  }

  const initialize = () => {
    new Audio(startSound).play();
    getGame1();
    getScores(1, user?.email);
    setScore(0);
    setTotal(0);
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

      //when it is final success
      if(total + 1 === 10) {
        //save scores
        addScores({ gameType: 1, userEmail: user?.email, score: score + 10 + count });
        //show msgbox
        setTimeout(() => {
          score + 10 + count >= 80 ? new Audio(victorySound).play() : new Audio(endSound).play();
          getScores(1, user?.email);
          openEndAlert();
        }, count + 1 >= 3 ? 1000 : 600);
      }

      if(count + 1 >= 3) {
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
      setAddition({ value: 10, bonus: count });
      setTimeout(() => {
        setAddition({ value: 0, bonus: 0 });
      }, 900);
    }
    else {
      //wrong case
      new Audio(wrongSound).play();
      setCount(0);            //initialize count
      // if(score < 2) setScore(0);   //This is for preventing the score get minus
      // else
      setScore(score - 2);
      setAddition({ value: -2, bonus: 0 });
      setTimeout(() => {
        setAddition({ value: 0, bonus: 0 });
      }, 900);
      
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
    initialize();
  }, []);

  useEffect(() => {
    setBoxes({
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
  }, [game1]);

  return (
    <div className="h-full py-10">
      {source ?
        <div className="fixed transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
          <video autoPlay loop muted className="grow" style={{ width: "150rem", height: "150rem" }}>
            <source src={source} type="video/webm" />
          </video>
        </div>
      :
        <></>
      }
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="fixed top-24 flex flex-col w-1/5 min-w-96 items-center p-6 pt-20 ml-20 rounded-lg">
          <Droppable droppableId="account">
            {(provided, snapshot) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="border-2 border-gray-200 bg-white rounded-lg w-full min-h-96 p-1 overflow-y-auto" style={{ maxHeight: '75vh' }}>
                {boxes.account?.map((item, index) => (
                  <Draggable key={item._id} draggableId={item._id} index={index}>
                    {(provided, snapshot) => (
                      <Tooltip title={item.tooltip} arrow><div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="border-2 border-gray-300 bg-gray-100 rounded-lg m-1 py-1 shadow-md flex items-center justify-center h-12 font-sans font-semibold">
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
        <div className="flex w-full justify-center">
          <div className="flex w-36" />
          <div className="flex flex-wrap justify-center w-3/5">
            <div className="flex flex-col w-1/3 min-w-96 items-center bg-blue-50 m-2 p-6 rounded-lg shadow-md">
              <h2 className="my-4 uppercase font-bold text-xl text-blue-800">Debit balance</h2>
              {debitCategories.map((droppableId) => (
                <Droppable key={droppableId} droppableId={droppableId}>
                  {(provided, snapshot) => (
                    <div className="flex flex-col w-full items-center mt-4">
                      <h3 className="mb-2 font-bold text-md text-blue-600">{categoryNames[droppableId]}</h3>
                      <div ref={provided.innerRef} {...provided.droppableProps} className="border-2 border-blue-200 bg-white rounded-lg w-full min-h-20 max-h-48 p-1 mb-4 shadow overflow-y-auto">
                        {boxes[droppableId]?.map((item, index) => (
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
            <div className="flex flex-col w-1/3 min-w-96 items-center bg-green-50 m-2 p-6 rounded-lg shadow-md">
              <h2 className="my-4 uppercase font-bold text-xl text-green-800">Credit balance</h2>
              {creditCategories.map((droppableId) => (
                <Droppable key={droppableId} droppableId={droppableId}>
                  {(provided, snapshot) => (
                    <div className="flex flex-col w-full items-center mt-4">
                      <h3 className="mb-2 font-bold text-md text-green-600">{categoryNames[droppableId]}</h3>
                      <div ref={provided.innerRef} {...provided.droppableProps} className="border-2 border-green-200 bg-white rounded-lg w-full min-h-20 max-h-48 p-1 mb-4 shadow overflow-y-auto">
                        {boxes[droppableId]?.map((item, index) => (
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
          </div>
        </div>
      </DragDropContext>
      <div className="fixed top-20 right-10 flex flex-col w-1/6 items-center pt-36 pl-5">
        <ScoreboardItem
          label="Max Score"
          value={scores?.max}
          bgColor="bg-green-400"
          textColor="text-white"
        />
        <ScoreboardItem
          label="Average Score"
          value={scores?.average?.toFixed(2)}
          bgColor="bg-amber-500"
          textColor="text-white"
        />
        {addition.value !== 0 &&
          <div className="w-40 fade-out-move-up">
            {addition.bonus !== 0 &&
              <div className="fixed w-40 text-center font-semibold text-lg transform -translate-y-full" style={{ color: "#33CCFF" }}>
                {"+" + addition.bonus + "💎"}
              </div>
            }
            <div className="fixed w-40 text-center font-bold text-3xl" style={{ color: addition.value > 0 ? "#27AE60" : "#C0392B" }}>
              {addition.value > 0 ? "+" + addition.value : "–" + (-addition.value)}
            </div>
          </div>
        }
        <ScoreboardItem
          label="Current Score"
          value={score}
          bgColor="bg-purple-500"
          textColor="text-white"
        />
      </div>
    </div>
  );
}

GameDashboard1.propTypes = {
  auth: PropTypes.object.isRequired,
  score: PropTypes.object.isRequired,
  game1: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  scores: state.scores,
  game1: state.game1,
});

export default connect(mapStateToProps, { getGame1, getScores, addScores })(
  GameDashboard1
);