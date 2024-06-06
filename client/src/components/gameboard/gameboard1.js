import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getCurrentProfile, deleteAccount } from '../../actions/profile';
import { Box, Grid, List, ListItemButton, ListItemText } from '@mui/material';


const itemLists = ["Derivative Liabilities", "Preferred Stock", "Capitalized Lease Agreement Intangle", "Patent"]


const GameDashboard1 = ({
  getCurrentProfile,
  deleteAccount,
  auth: { user },
  profile: { profile, loading },
}) => {

  const [selectedIndex, setSelectedIndex] = useState();
  const [tempList1, setTempList1] = useState([]);

  useEffect(() => {
    getCurrentProfile();
    // }, []);
  }, [getCurrentProfile]);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', e.target.textContent);
  };

   //Functions for drop event
  const handleDrop = (e) => {
    e.preventDefault();
    let data = e.dataTransfer.getData('Text/plain');
    let t = [...tempList1];
    t.push(data);
    setTempList1(t);

  };

  const handleAllowDrop = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
     console.log(tempList1)
  }, [tempList1])




  return (
    <div> 
       <Grid container spacing={2}>
       
          <Grid item xs={4}>
              <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              <List component="nav" aria-label="main mailbox folders">
                {itemLists.map((item, index) => (
                  <ListItemButton
                    key={`item-${item}`}
                    selected={selectedIndex === index}
                    draggable={true}
                    id={item.id}
                    onDragStart={handleDragStart}
                  >
                    <ListItemText primary={item} />
                  </ListItemButton>
                ))}
              </List>
            </Box>
          </Grid>
          <Grid item xs={8}>
             <div
                className="visual-main-panel-screen-content"
                onDrop={handleDrop}
                onDragOver={handleAllowDrop}
                style={{width : 250, height : 250, border: 2, borderColor : "black", borderRadius : 5, backgroundColor: "gray"}}
              >
                  {tempList1.map((item, index) => (
                    <ListItemButton
                      key={`item-${item}`}
                      selected={selectedIndex === index}
                      draggable={true}
                      id={item}
                    >
                      <ListItemText primary={item} />
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
