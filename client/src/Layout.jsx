import { AppBar, Box, Button, IconButton, Toolbar, Typography, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle}>
      <List>
        {['Page 1', 'Page 2', 'Page 3', 'Page 4'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <header>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                News
              </Typography>
              <Button
                color="inherit"
                onClick={navigate("/dashboard")}
              >
                Home
              </Button>
            </Toolbar>
          </AppBar>
          <Drawer
            anchor="left"
            open={isDrawerOpen}
            onClose={handleDrawerToggle} // Close drawer when clicking outside
          >
            {DrawerList}
          </Drawer>
        </Box>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto p-4">
        {children}
      </main>

      <footer className="w-full p-4 text-center text-sm text-gray-500">
        Project M - Bitcamp 2025
      </footer>
    </div>
  );
};

export default Layout;