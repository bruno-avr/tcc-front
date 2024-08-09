import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Paper, Typography, Box } from '@mui/material';

function TeacherCard({ teacher, index }) {
  return (
    <Draggable draggableId={String(teacher.id)} key={teacher.id} index={index}>
      {(provided, snapshot) => (
        <Paper
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
        >
          <Box sx={{ textAlign: 'center', marginBottom: 2, padding: 2 }}>
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
