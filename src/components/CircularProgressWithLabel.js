import { CircularProgress, Box, Typography, useMediaQuery } from '@mui/material';

function CircularProgressWithLabel(props) {
  // Use media query to check screen width
  const isMobile = useMediaQuery('(max-width:600px)'); // Adjust the max-width as needed

  return (
    <Box
      position="fixed"
      top="50%"
      left={isMobile ? '45%' : '50%'} // Conditional left based on screen size
      transform="translate(-50%, -50%)"
      display="inline-flex"
    >
      <CircularProgress
        variant="determinate"
        {...props}
        style={{ color: '#8D0709' }} // Red color for the progress circle
      />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption" component="div" color="textSecondary">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

export default CircularProgressWithLabel;
