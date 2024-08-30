import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Box, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { v4 as uuidv4 } from 'uuid';
import Column from './Column';
import BookmarkIcon from "@mui/icons-material/Bookmark";
import TeacherAPI from '../../../services/API/TeacherAPI';
import Requester from '../../../services/Requester/Requester';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Priorities() {
  const [columns, setColumns] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  
  function goBack() {
    const aux = location.pathname.split("/");
    aux.pop();
    navigate(aux.join("/"));
  }

  async function getData() {
    try {
      const teacherApi = new TeacherAPI(Requester);
      const response = await teacherApi.getPriorities();
      setColumns(response);
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function savePriorities() {
    try {
      const teacherApi = new TeacherAPI(Requester);
      await teacherApi.savePriorities(columns);
      toast.success("As prioridades foram salvas com sucesso!");
      goBack();

    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const handleDragEnd = (result) => {
    const { source, destination, draggableId, type } = result;

    if (!destination) return;

    if (type === 'COLUMN') {
      const reorderedColumns = Array.from(columns);
      const [movedColumn] = reorderedColumns.splice(source.index, 1);
      reorderedColumns.splice(destination.index, 0, movedColumn);
      setColumns(reorderedColumns.map((col, index) => ({ ...col, priority: index })));
    } else {
      if (source.droppableId !== destination.droppableId) {
        const startColumn = columns.find(col => col.id === source.droppableId);
        const endColumn = columns.find(col => col.id === destination.droppableId);
        const draggedTeacher = startColumn.teachers.find(teacher => teacher.id === draggableId);
        if (!startColumn || !endColumn || !draggedTeacher) return;

        const updatedStartColumnTeachers = startColumn.teachers.filter(teacher => teacher.id !== draggableId);
        const updatedEndColumnTeachers = [...endColumn.teachers, draggedTeacher];
        updatedEndColumnTeachers.sort(function (a, b) {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });

        setColumns(columns.map(col => {
          if (col.id === startColumn.id) {
            return { ...col, teachers: updatedStartColumnTeachers };
          }
          if (col.id === endColumn.id) {
            return { ...col, teachers: updatedEndColumnTeachers };
          }
          return col;
        }));
      } else {
        const column = columns.find(col => col.id === source.droppableId);
        const updatedTeachers = Array.from(column.teachers);
        const [movedTeacher] = updatedTeachers.splice(source.index, 1);
        updatedTeachers.splice(destination.index, 0, movedTeacher);

        setColumns(columns.map(col => col.id === column.id ? { ...col, teachers: updatedTeachers } : col));
      }
    }
  };

  const addColumn = () => {
    const newPriority = columns.length;
    setColumns([
      ...columns,
      { id: uuidv4(), priority: newPriority, teachers: [] }
    ]);
  };

  const removeColumn = (column) => {
    setColumns(columns.filter(col => col.id !== column.id).map(col => {
        if (col.priority > column.priority) col.priority--;
        return col
    }));
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: 'calc(100vh - 64px)',
        overflowX: 'auto',
        paddingY: 4,
        paddingX: 3,
      }}
    >
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="all-columns" direction="horizontal" type="COLUMN">
          {(provided) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{
                display: 'flex',
                gap: 2,
                minWidth: '100%',
              }}
            >
              {columns.map((column, index) => (
                <Draggable draggableId={String(column.id)} index={index} key={column.id}>
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{ flex: '0 0 250px' }}
                    >
                      <Column numColumns={columns.length} column={column} index={index} removeColumn={removeColumn} />
                    </Box>
                  )}
                </Draggable>
              ))}
              <Box
                sx={{
                    marginTop: 1.2,
                    paddingRight: 10
                }}
              >
                <IconButton
                  onClick={addColumn}
                >
                  <AddIcon />
                </IconButton>
              </Box>
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
      <Box
        sx={{
          position: 'absolute',
          bottom: 24,
          right: 24,
        }}
      >
        <Button
          onClick={savePriorities}
          startIcon={<BookmarkIcon />}
          variant="contained"
          color="success"
        >
          Salvar
        </Button>
      </Box>
    </Box>
  );
}

export default Priorities;
