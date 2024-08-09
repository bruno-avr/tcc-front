import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Paper, Typography, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import TeacherCard from '../TeacherCard';

function Column({ column, removeColumn }) {
  return (
    <Droppable droppableId={String(column.id)} key={column.id}>
      {(provided, snapshot) => (
        <Paper
          ref={provided.innerRef}
          {...provided.droppableProps}
          isDraggingOver={snapshot.isDraggingOver}
          sx={{
            padding: 2,
            backgroundColor: snapshot.isDraggingOver ? 'primary.light' : 'background.paper',
            minHeight: 200,
            flex: '0 0 250px',
            transition: 'background-color 0.2s ease',
            position: 'relative',
          }}
        >
          <Box sx={{ textAlign: 'center', marginBottom: 2 }}>
            <Typography variant="h6" component="div">
              {column.priority ? `Prioridade ${column.priority}` : "Sem prioridade"}
            </Typography>
            <Box
                sx={{
                position: 'absolute',
                top: 20,
                left: 12,
                color: 'text.secondary',
                }}
            >
                <DragIndicatorIcon />
            </Box>
            {column.teachers.length === 0 && (
              <IconButton
                onClick={() => removeColumn(column)}
                sx={{
                  position: 'absolute',
                  top: 11,
                  right: 8,
                  color: 'text.secondary',
                }}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>

          {column.teachers.map((teacher, index) => (
            <TeacherCard teacher={teacher} index={index} key={teacher.id} />
          ))}

          {provided.placeholder}
        </Paper>
      )}
    </Droppable>
  );
}

export default Column;
