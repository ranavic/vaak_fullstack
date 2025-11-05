import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}>
          Vaak
        </Typography>
        <Button color="inherit" component={Link} to="/">Chat</Button>
        <Button color="inherit" component={Link} to="/dictionary">Dictionary</Button>
        <Button color="inherit" component={Link} to="/translate">Translate</Button>
        <Button color="inherit" component={Link} to="/history">History</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
