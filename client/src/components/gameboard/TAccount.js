import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CurrencyFormatter from "currency-formatter";
import { FormControlLabel, Tooltip, Select, MenuItem, Card, CardContent, Typography, Checkbox, Button } from '@mui/material';
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
import ScoreboardItem from './components/ScoreboardItem';
import TAccountItem from './components/TAccountItem';

const GameDashboard1 = ({
  auth: { user },
  getGame2,
  getAccountingItems,
  getScores,
  addScores,
  scores: { scores, loading: scoreLoading },
  game2: { itemNames, problemArray, debitAnswer, creditAnswer, loading: gameLoading },
}) => {

  const [showAnswer, setShowAnswer] = useState(false);    //whether to show answers or not
  const [submitDisabled, setSubmitDisabled] = useState(false);    //whether to disable submit button or not
  const [score, setScore] = useState(0);
  const [addition, setAddition] = useState(0);    //show addition to the score
  const [category, setCategory] = useState();
  const [namesObject, setNamesObject] = useState({});       //save each category's accounting items
  const [boxes, setBoxes] = useState({ account: [], debit1: [], credit1: [] });
  const [debitArray, setDebitArray] = useState(new TArray({ array: [new TAccount({ boxName: "debit1" })] }));
  const [creditArray, setCreditArray] = useState(new TArray({ array: [new TAccount({ boxName: "credit1" })] }));
  
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

    //increase the length of TArray
    if(destDroppableId !== "account") {
      let destType = destDroppableId.includes("debit") ? "debit" : "credit";
      let destArray = destType === "debit" ? debitArray : creditArray;
      if(Number(destDroppableId.match(/\d+$/)) === destArray.array.length) {
        //if we put to the last TAccount, TArray will increase
        let boxName = `${destType}${destArray.array.length + 1}`;
        destArray.array.push(new TAccount({ boxName }));
        destType === "debit" ? setDebitArray(new TArray({ ...destArray })) : setCreditArray(new TArray({ ...destArray }));
        boxes[boxName] = [];
        setBoxes({ ...boxes });
      }
    }

    //decrease the length of TArray
    if(srcDroppableId !== "account" && srcDroppableId !== destDroppableId) {
      let srcType = srcDroppableId.includes("debit") ? "debit" : "credit";
      let srcArray = srcType === "debit" ? debitArray : creditArray;
      if(Number(srcDroppableId.match(/\d+$/)) === srcArray.array.length - 1) {
        //if the last TAccount is empty and we get out from the vice-last TAccount, TArray will decrease
        srcArray.array.pop();
        srcType === "debit" ? setDebitArray(new TArray({ ...srcArray })) : setCreditArray(new TArray({ ...srcArray }));
      }
    }
  };
  
  const handleInput = (input, oldTArray, setTArray, arrayIndex, balanceType, balanceIndex) => {
    //input values to the input field in every TAccount
    let value = Number(input.replace(/,/g, ""));
    if(!value) value = "";
    oldTArray.array[arrayIndex][balanceType][balanceIndex] = value;

    //increase the length TAccount array
    if(value && balanceIndex === oldTArray.array[arrayIndex][balanceType].length - 1) {
      oldTArray.array[arrayIndex][balanceType].push(""); //if we put to the last input, balance will increase
    }

    //decrease the length TAccount array
    if(!value && balanceIndex === oldTArray.array[arrayIndex][balanceType].length - 2) {
      oldTArray.array[arrayIndex][balanceType].pop();  //if we put 0 to the vice-last input, balance will decrease
    }

    setTArray(new TArray({ ...oldTArray }));   //set state
  }

  const evaluate = () => {
    //input values to the input field in every TAccount
    let prompt = [], answer = [], count = 0;    //count is used to count how many answers are right

    if(!equalCondition()) {
      getMinusScore();
      Swal.fire({
        title: "Imbalance!",
        text: "Please compare the total debit and the total credit.",
        type: "error",
        confirmButtonText: "OK",
        showCloseButton: true,
      });
      return;
    }
    //create prompt array
    debitArray.array.map((TAccount) => {
      TAccount.debit.map((val) => {val && prompt.push(`${boxes[TAccount.boxName][0]?.name} debit ${val}`)});
      TAccount.credit.map((val) => {val && prompt.push(`${boxes[TAccount.boxName][0]?.name} credit ${val}`)});
    })
    creditArray.array.map((TAccount) => {
      TAccount.debit.map((val) => {val && prompt.push(`${boxes[TAccount.boxName][0]?.name} debit ${val}`)});
      TAccount.credit.map((val) => {val && prompt.push(`${boxes[TAccount.boxName][0]?.name} credit ${val}`)});
    })

    //create answer array
    debitAnswer.array.map((TAccount) => {
      TAccount.debit.map((val) => {val && answer.push(`${TAccount.name} debit ${val}`)});
      TAccount.credit.map((val) => {val && answer.push(`${TAccount.name} credit ${val}`)});
    })
    creditAnswer.array.map((TAccount) => {
      TAccount.debit.map((val) => {val && answer.push(`${TAccount.name} debit ${val}`)});
      TAccount.credit.map((val) => {val && answer.push(`${TAccount.name} credit ${val}`)});
    })

    answer.map((ans) => {
      let index = prompt.indexOf(ans);
      if(index >= 0) {
        count++;
        prompt.splice(index, 1);
      }     //it means that there is a correct prompt for that answer
    })
    count -= prompt.length / 5;         //we deduct points when there lefts unnecessary prompts
    let plusScore = score + Math.max(0, (100 * count / answer.length).toFixed(2));

    //save scores
    addScores({ gameType: 2, userEmail: user?.email, score: score + plusScore });
    score + plusScore >= 80 ? new Audio(victorySound).play() : new Audio(endSound).play();
    Swal.fire({
      title: score >= 80 ? "Congratulations!" : "Cheer up!",
      text: `You got ${score + plusScore} points.`,
      type: "success",
      confirmButtonText: "OK",
      showCloseButton: true,
    });

    //disable submit
    setSubmitDisabled(true);

    //update score panel
    setScore(score + plusScore);
    getScores(2, user?.email);
    setAddition(plusScore);
    setTimeout(() => setAddition(0), 900);
  }

  const equalCondition = () => {
    let difference = showAnswer ? (debitAnswer.total - creditAnswer.total) : (debitArray.total - creditArray.total);
    return Math.abs(difference) < 0.000001;
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
    new Audio(startSound).play();
    getScores(2, user?.email);
    getGame2();
    setCategory(debitCategories[0]);      //We want to the useEffect above takes effect in initializing
  }, []);

  return (
    <div className="h-full px-36 py-20">
      <Card variant="outlined" style={{ width: '90%', borderRadius: 20, maxHeight: '25vh', overflowY: 'auto', marginBottom: '3rem', marginLeft: 'auto', marginRight: 'auto', padding: '5px' }}>
        <CardContent>
          <Typography variant="h5" component="h2" style={{ fontWeight: 'bold', marginBottom: '10px' }}>
            Problem
          </Typography>
          {problemArray.map((item, i) => {
            return <Typography variant="h6" component="p" style={{ fontFamily: '"Segoe UI Symbol"' }} key={i}>{i + 1}. {item}</Typography>;
          })}
        </CardContent>
      </Card>
      <div className="flex justify-between">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex flex-col items-center p-4 pt-7 rounded-lg">
            <h2 className="mb-4 uppercase font-bold text-xl text-gray-800">Account</h2>
            <div className="h-5" />
            <Select value={category || debitCategories[0]} onChange={(e) => setCategory(e.target.value)} sx={{ width: '20rem', height: '3rem' }}>
              {([...debitCategories, ...creditCategories]).map((category) => (
                <MenuItem value={category}>{categoryNames[category]}</MenuItem>
              ))}
            </Select>
            <div className="h-2" />
            <Droppable droppableId="account">
              {(provided, snapshot) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="border-2 border-gray-200 bg-white rounded-lg p-1 min-h-96 overflow-y-auto" style={{ maxHeight: "60svh"}}>
                  {boxes["account"]?.map((item, index) => (
                    <Draggable key={item._id} draggableId={item._id} index={index}>
                      {(provided, snapshot) => (
                        <Tooltip title={item.tooltip} arrow><div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="border-2 border-gray-300 bg-gray-100 rounded-lg mb-1 shadow-md flex items-center justify-center w-72 h-8 font-sans font-semibold">
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
          <div className="flex flex-col w-1/5 min-w-80 items-center bg-blue-50 p-4 rounded-lg shadow-md">
            <h2 className="mt-6 mb-4 uppercase font-bold text-xl text-blue-800">Debit</h2>
            <h4 className={`mb-14 text-lg font-sans font-bold ${equalCondition() ? "text-cyan-800" : "twinkle"}`}>
              Total : {CurrencyFormatter.format((showAnswer ? debitAnswer.total : debitArray.total), { code: "USD" })}
            </h4>
            {showAnswer ? (
              debitAnswer?.array?.map((TAccount, index) => <TAccountItem key={index} TAccount={TAccount} />)
            ) : (
              debitArray.array.map((TAccount, index) => (
                <TAccountItem
                  key={index}
                  TAccount={TAccount}
                  boxes={boxes}
                  twinkle={index < debitArray.array.length - 1}   //it means that this element is not the last(for twinkle)
                  onChange={(val, balType, balIndex) => 
                    handleInput(val, debitArray, setDebitArray, index, balType, balIndex)
                  }
                />
              ))
            )}
          </div>
          <div className="flex flex-col w-1/5 min-w-80 items-center bg-green-50 p-4 rounded-lg shadow-md">
            <h2 className="mt-6 mb-4 uppercase font-bold text-xl text-green-800">Credit</h2>
            <h4 className={`mb-14 text-lg font-sans font-bold ${equalCondition() ? "text-cyan-800" : "twinkle"}`}>
              Total : {CurrencyFormatter.format((showAnswer ? creditAnswer.total : creditArray.total), { code: "USD" })}
            </h4>
            {showAnswer ? (
              creditAnswer?.array?.map((TAccount, index) => <TAccountItem key={index} TAccount={TAccount} />)
            ) : (
              creditArray.array.map((TAccount, index) => (
                <TAccountItem
                  TAccount={TAccount}
                  boxes={boxes}
                  twinkle={index < creditArray.array.length - 1}   //it means that this element is not the last(for twinkle)
                  onChange={(val, balType, balIndex) => 
                    handleInput(val, creditArray, setCreditArray, index, balType, balIndex)
                  }
                />
              ))
            )}
          </div>
          <div className="flex flex-col items-center pt-36 sticky top-36">
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
                <div className="fixed w-40 text-center font-bold text-3xl" style={{ color: addition > 0 ? "#27AE60" : "#C0392B" }}>
                  {addition > 0 ? `+ ${addition}` : `– ${-addition}`}
                </div>
              </div>
            }
            <ScoreboardItem
              label="Current Score"
              value={score}
              bgColor="bg-purple-500"
              textColor="text-white"
            />
            <Button
              variant="contained"
              className="bg-blue-600 hover:bg-blue-800 text-white"
              type="submit"
              disabled={submitDisabled} // Add disabled prop
              onClick={evaluate}
            >
              Submit
            </Button>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showAnswer}
                  onChange={(e) => {setShowAnswer(e.target.checked);setSubmitDisabled(true)}}
                  color="primary"
                />
              }
              label="Reveal Answer"
              style={{ marginTop: "20px", marginLeft: "auto", marginRight: "auto", paddingRight: "12px" }}
            />
          </div>
        </DragDropContext>
      </div>
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