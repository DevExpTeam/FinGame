'use strict';

import React, { Fragment, useEffect, useState } from 'react';
import  { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getCurrentProfile, deleteAccount } from '../../actions/profile';
import { Box, Grid, List, ListItemButton, ListItemText } from '@mui/material';
import * as ReactDOM from 'react-dom';
import Dragula from 'react-dragula';



const GameDashboard1 = ({
  getCurrentProfile,
  deleteAccount,
  auth: { user },
  profile: { profile, loading },
}) => {

  const [selectedIndex, setSelectedIndex] = useState();
  const [tempList1, setTempList1] = useState([]);

  
  const [itemLists, setItemLists] = useState(["Derivative Liabilities", "Preferred Stock", "Capitalized Lease Agreement Intangle", "Patent"]);


  useEffect(() => {
    getCurrentProfile();
    // }, []);
  }, [getCurrentProfile]);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', e.target.textContent);
  };

  const dragulaDecorator = (componentBackingInstance) => {
    if (componentBackingInstance) {
      let options = { };
      Dragula([componentBackingInstance], options);
    }
  };


   //Functions for drop event
  const handleMainBoardDrop = (e) => {
    e.preventDefault();
    let data = e.dataTransfer.getData('Text/plain');
    if(data === "") return;

    let t = [...tempList1];
    t.push(data);
    setTempList1(t);

    let tmpItemList = [...itemLists]
    if (tmpItemList.includes(data)) {
        var index = tmpItemList.indexOf(data);
        if (index > -1) {
          tmpItemList.splice(index, 1);
        }
    }
    setItemLists(tmpItemList)
  };

  const handleItemListDrop = (e) => {

      e.preventDefault();
      let data = e.dataTransfer.getData('Text/plain');
      if(data === "") return;

      let t = [...itemLists];
      t.push(data);
      setItemLists(t);

      let tmpItemList = [...tempList1]
      if (tmpItemList.includes(data)) {
          var index = tmpItemList.indexOf(data);
          if (index > -1) {
            tmpItemList.splice(index, 1);
          }
      }
      setTempList1(tmpItemList)
  }

  const handleAllowDrop = (e) => {
    e.preventDefault();
  };




  return (
    <div> 
       <Grid container spacing={2}>
          <Grid item xs={4}>
              <Box sx={{ width: '100%', maxWidth: 360, minHeight : 600,  bgcolor: 'background.paper' }}   
                  onDragStart={handleDragStart}
                  onDragOver={handleAllowDrop}
                  onDrop={handleItemListDrop}
                  
                  >
                
              <List component="nav" aria-label="main mailbox folders" className='container' >
                {(itemLists).map((item, index) => (
                  <ListItemButton
                    key={`item-${item}`}
                    selected={selectedIndex === index}
                    draggable={true}
                    id={item.id}
                  
                   
                  >
                    <ListItemText primary={item}  style={{ border : 3, borderColor : "black",  borderRadius : 5, marging : 3, padding: 5, border : "1px solid black" }}/>
                  </ListItemButton>
                ))}
              </List>
            </Box>
          </Grid>
          <Grid item xs={8}>
             <div
                className="visual-main-panel-screen-content"
                onDragStart={handleDragStart}
                onDrop={handleMainBoardDrop}
                onDragOver={handleAllowDrop}
                style={{width : 250, height : 250, border: 2, borderColor : "black", borderRadius : 5, border : "1px solid black" }}
              >
                  {tempList1.map((item, index) => (
                    <ListItemButton
                      key={`item-${item}`}
                      selected={selectedIndex === index}
                      draggable={true}
                      id={item}
                    >
                      <ListItemText primary={item} style={{ border : 3, borderColor : "black",  borderRadius : 5, padding: 5,  border : "1px solid black"  }}/>
                  </ListItemButton>
                ))}
              </div>
          </Grid>
      </Grid>
    </div>
  )



};

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
