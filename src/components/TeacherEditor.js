import React, { useEffect, useState } from "react";

import {
  Box,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import WaitLoading from "./WaitLoading";
import SubjectAPI from "../services/API/SubjectAPI";
import { toast } from "react-toastify";
import requester from "../services/Requester/Requester";

export default function TeacherEditor({
  selectedTeacher,
  isOpen,
  setNewTeacher,
}) {
  const [loading, setLoading] = useState(false);
  const [teacherName, setTeacherName] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState({});

  async function getData() {
    setLoading(true);
    try {
      const subjectApi = new SubjectAPI(requester);
      const response = await subjectApi.getSubjectsPerClass();
      setSubjects(response);
      setTeacherName(selectedTeacher?.name || "");

      const aux = {};
      for (const key in selectedTeacher?.selectedClasses || {}) {
        aux[key] = [];
        selectedTeacher.selectedClasses[key].forEach((el) => {
          const subject = response.find((s) => s.id === key);
          const _class = subject.classes.find(
            (c) =>
              c.id === el.id &&
              c.name === el.name &&
              c.subjectPerGradeId === el.subjectPerGradeId
          );
          aux[key].push(_class);
        });
      }
      setSelectedClasses(aux);
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (isOpen) getData();
  }, [selectedTeacher]);

  useEffect(() => {
    const allValues = [];
    for (const key in selectedClasses) {
      allValues.push(...selectedClasses[key]);
    }
    setNewTeacher({
      name: teacherName,
      classes: allValues,
    });
  }, [teacherName, selectedClasses]);

  return (
    <WaitLoading loading={loading}>
      <TextField
        autoFocus
        margin="dense"
        id="teacherName"
        label="Nome do Professor"
        type="text"
        fullWidth
        value={teacherName}
        onChange={(e) => setTeacherName(e.target.value)}
        required
      />
      <Divider sx={{ my: 2 }} />
      <Typography textAlign="center" variant="h5" component="div">
        Disciplinas
      </Typography>
      <Divider sx={{ mt: 2 }} />
      {subjects.map((subject) => (
        <FormControl
          id={`${subject.id}-chip-label`}
          key={subject.id}
          fullWidth
          sx={{ mt: 2 }}
        >
          <InputLabel>{subject.name}</InputLabel>
          <Select
            labelId={`${subject.id}-chip-label`}
            id={`${subject.id}-chip`}
            multiple
            value={selectedClasses[subject.id] || []}
            onChange={(e) => {
              setSelectedClasses((curr) => {
                const copy = { ...curr };
                if (!e.target.value?.length) {
                  delete copy[subject.id];
                } else {
                  copy[subject.id] = e.target.value;
                }
                return copy;
              });
            }}
            input={
              <OutlinedInput
                id={`${subject.id}-select-chip`}
                label={subject.name}
              />
            }
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value.id} label={value.name} />
                ))}
              </Box>
            )}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 48 * 4.5 + 8,
                  width: 250,
                },
              },
            }}
          >
            {subject.classes.map((el) => (
              <MenuItem key={el.id} value={el}>
                {el.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}
    </WaitLoading>
  );
}
