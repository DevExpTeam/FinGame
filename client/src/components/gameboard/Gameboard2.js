import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Swal from "sweetalert2";
import startSound from '../../sound/start.mp3';
import wrongSound from '../../sound/wrong.mp3';
import victorySound from '../../sound/victory.wav';
import endSound from '../../sound/end.mp3';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { getGame2, getAccountingItems } from '../../actions/game';
import { getScores, addScores } from '../../actions/scores';
import { TAccount, TArray } from '../../models/TAccounting';
import { debitCategories, creditCategories, categoryNames } from './Constants';
import ScoreboardItem from './ScoreboardItem';
import BVAInput from './BVAInput';

const GameDashboard1 = ({
  auth: { user },
  getGame2,
  getAccountingItems,
  getScores,
  addScores,
  scores: { scores, loading: scoreLoading },
  game2: { itemNames, question, answers, loading: gameLoading },
}) => {
  const [score, setScore] = useState(0);
  const [category, setCategory] = useState("currentAssets");
  const [boxes, setBoxes] = useState({ account: [], debit1: [], credit1: [] });
  const [addition, setAddition] = useState(0);    //show addition to the score
  const [debitArray, setDebitArray] = useState(new TArray({ array: [new TAccount({ boxName: "debit1" })] }));
  const [creditArray, setCreditArray] = useState(new TArray({ array: [new TAccount({ boxName: "credit1" })] }));
  const [namesObject, setNamesObject] = useState({});

  const openEndAlert = async () => {
    const result = await Swal.fire({
      title: score >= 80 ? "Congratulations!" : "Cheer up!",
      text: "Would you like to continue the game?",
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
  
  const getMinusScore = () => {
    setScore(score - 10);
    setAddition(-10);
    setTimeout(() => setAddition(0), 900);
  }

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    //get source and destination account item arrays
    //we use array without loosing them([...]) because we want the drag & drop effect to the original array
    const srcDroppableId = source.droppableId;
    const destDroppableId = destination.droppableId;
    const srcItems = boxes[srcDroppableId];
    const destItems = destDroppableId === srcDroppableId ? srcItems : boxes[destDroppableId];

    if (destDroppableId !== "account" && srcDroppableId !== destDroppableId && boxes[destDroppableId].length) {
      //to prevent other arrays to have more than 1 item
      new Audio(wrongSound).play();
      return;
    }

    if (destDroppableId === "account" && srcItems[source.index].answer !== category) {
      //to prevent an item to go wrong category's account box.
      new Audio(wrongSound).play();
      getMinusScore();
      Swal.fire({
        title: "Wrong Category!",
        text: `${srcItems[source.index].name} belongs to ${categoryNames[srcItems[source.index].answer]}.`,
        type: "error",
        confirmButtonText: "OK",
        showCloseButton: true,
      });
      return;
    }

    if (!(
      destDroppableId === "account" ||
      (destDroppableId.includes("debit") && debitCategories.includes(srcItems[source.index].answer)) ||
      (destDroppableId.includes("credit") && creditCategories.includes(srcItems[source.index].answer))
    )) {
      //to prevent an item to go wrong TArray
      new Audio(wrongSound).play();
      getMinusScore();
      Swal.fire({
        title: "Wrong Entry!",
        text: `${srcItems[source.index].name} is a ${destDroppableId.includes("debit") ? "credit" : "debit"} entry.`,
        type: "error",
        confirmButtonText: "OK",
        showCloseButton: true,
      });
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

    if(destDroppableId !== "account") {
      //increase the length of TArray
      let destType = destDroppableId.includes("debit") ? "debit" : "credit";
      let destArray = destType === "debit" ? debitArray : creditArray;
      if(Number(destDroppableId.match(/\d+$/)) === destArray.array.length) {
        //if we put to the last TAccount, TArray will increase
        let boxName = `${destType}${destArray.array.length + 1}`;
        destArray.array.push(new TAccount({ boxName }));
        destType === "debit" ? setDebitArray({ ...destArray }) : setCreditArray({ ...destArray });
        boxes[boxName] = [];
        setBoxes({ ...boxes });
      }
    }

    if(srcDroppableId !== "account" && srcDroppableId !== destDroppableId) {
      //decrease the length of TArray
      let srcType = srcDroppableId.includes("debit") ? "debit" : "credit";
      let srcArray = srcType === "debit" ? debitArray : creditArray;
      if(
        Number(srcDroppableId.match(/\d+$/)) === srcArray.array.length - 1 &&
        boxes[`${srcType}${srcArray.array.length}`].length === 0
      ) {
        //if we get out from the vice-last TAccount and last TAccount is empty, TArray will decrease
        srcArray.array.pop();
        srcType === "debit" ? setDebitArray({ ...srcArray }) : setCreditArray({ ...srcArray });
      }
    }
  };
  
  const initialize = () => {
    new Audio(startSound).play();
    getScores(2, user?.email);
    setScore(0);
  }

  useEffect(() => {
    namesObject[category] = [...itemNames];
    setBoxes({ ...boxes, account: namesObject[category] });
    setNamesObject({ ...namesObject });       //save current category's account items array in the namesObject
  }, [itemNames]);

  useEffect(() => {
    //we use array without loosing them([...]) because we want the drag & drop effect to the original array
    if(namesObject[category]?.length) setBoxes({ ...boxes, account: namesObject[category] });
    else getAccountingItems(category);   //it changes itemNames Array so the above useEffect occurs
  }, [category]);

  useEffect(() => {
    initialize();
  }, []);

  return (
    <div className="flex justify-between h-full px-36 py-20">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex flex-col items-center p-4 pt-7 rounded-lg sticky top-7">
          <h2 className="mb-4 uppercase font-bold text-xl text-gray-800">Account</h2>
          <div className="h-5" />
          <Select value={category} onChange={(e) => setCategory(e.target.value)} sx={{ width: '20rem', height: '3rem' }}>
            <MenuItem value={"currentAssets"}>Current Assets</MenuItem>
            <MenuItem value={"propertyPlantEquipment"}>Property, Plant & Equipment</MenuItem>
            <MenuItem value={"intangibleAssets"}>Intangible Assets</MenuItem>
            <MenuItem value={"financialAssets"}>Financial Assets</MenuItem>
            <MenuItem value={"digitalAssets"}>Digital Assets</MenuItem>
            <MenuItem value={"currentLiabilities"}>Current Liabilities</MenuItem>
            <MenuItem value={"longTermLiabilities"}>Long-Term Liabilities</MenuItem>
            <MenuItem value={"accruals"}>Accruals</MenuItem>
            <MenuItem value={"capital"}>Capital</MenuItem>
          </Select>
          <div className="h-2" />
          <Droppable droppableId="account">
            {(provided, snapshot) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="border-2 border-gray-200 bg-white rounded-lg p-1 min-h-96 overflow-y-auto" style={{ maxHeight: "60svh"}}>
                {boxes["account"]?.map((item, index) => (
                  <Draggable key={item._id} draggableId={item._id} index={index} style={{ zIndex: 1000 }}>
                    {(provided, snapshot) => (
                      <Tooltip title={item.tooltip} arrow><div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="border-2 border-gray-300 bg-gray-100 rounded-lg mb-1 shadow-md flex items-center justify-center w-72 h-8 font-sans font-semibold" style={{ ...provided.draggableProps.style, zIndex: 6000 }}>
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
          <h2 className="mb-4 uppercase font-bold text-xl text-blue-800">Asset</h2>
          {debitArray.array.map((TAccount) => (
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
                  <TextField size="small" sx={{ width: '8rem', bgcolor: 'white', mt: 1 }} />
                </Box>
                <Box sx={{ borderColor: 'divider', pb: 2, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <TextField size="small" sx={{ width: '8rem', bgcolor: 'white', mt: 1 }} />
                </Box>
              </Box>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center bg-green-50 p-4 rounded-lg shadow-md">
          <h2 className="mb-4 uppercase font-bold text-xl text-green-800">Liabilities + Equity</h2>
          {creditArray.array.map((TAccount) => (
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
                  <TextField size="small" sx={{ width: '8rem', bgcolor: 'white', mt: 1 }} />
                </Box>
                <Box sx={{ borderColor: 'divider', pb: 2, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <TextField size="small" sx={{ width: '8rem', bgcolor: 'white', mt: 1 }} />
                </Box>
              </Box>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center pt-36 pl-5 sticky top-36">
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
          {addition !== 0 &&
            <div className="w-40 fade-out-move-up">
              <div className="fixed w-40 text-center font-bold text-3xl" style={{ color: "#C0392B" }}>
                {`– ${-addition}`}
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
      </DragDropContext>
    </div>
  );
}

GameDashboard1.propTypes = {
  auth: PropTypes.object.isRequired,
  score: PropTypes.object.isRequired,
  game2: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  scores: state.scores,
  game2: state.game2,
});

export default connect(mapStateToProps, { getGame2, getAccountingItems, getScores, addScores })(
  GameDashboard1
);