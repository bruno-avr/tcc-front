import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Paper, Typography, Box, Avatar } from '@mui/material';

// Function to hash a string and generate a darker color
function stringToColor(string) {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xFF;
    // Scale the value to a darker range
    value = Math.floor(value * 0.7);  // Scale down to avoid light colors
    color += ('00' + value.toString(16)).slice(-2);
  }
  return color;
}

function TeacherCard({ teacher, index }) {
  // Generate a color based on the teacher's name
  const avatarColor = stringToColor(teacher.name);

  return (
    <Draggable draggableId={String(teacher.id)} key={teacher.id} index={index}>
      {(provided, snapshot) => (
        <Paper
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
        >
          <Box sx={{ alignItems: 'center', marginBottom: 2, padding: 2, display: 'flex' }}>
            <Avatar sx={{ marginRight: 2, bgcolor: avatarColor }}>
              {teacher.name.toUpperCase()[0]}
            </Avatar>
            <Typography variant="h6" component="div">
              {teacher.name}
            </Typography>
          </Box>
          
          {provided.placeholder}
        </Paper>
      )}
    </Draggable>
  );
}

export default TeacherCard;
