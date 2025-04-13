import AppBar from 'mui/material/AppBar';
import Box from 'mui/material/Box';
import Toolbar from 'mui/material/Toolbar';
import Typography from 'mui/material/Typography';
import Button from 'mui/material/Button';
import IconButton from 'mui/material/IconButton';

const Layout = ({ children }) => {
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
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            News
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
        </header>
  
        <main className="flex-1 w-full max-w-4xl mx-auto p-4">
          {children}
        </main>
  
        <footer className="w-full p-4 text-center text-sm text-gray-500">
          © 2025 My App
        </footer>
      </div>
    );
  };
  
  export default Layout;