import React, { useEffect, useState } from "react";

import {
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
} from "@mui/material";
import requester from "../services/Requester/Requester";
import { toast } from "react-toastify";
import GradeAPI from "../services/API/GradeAPI";
import WaitLoading from "./WaitLoading";

export default function SubjectEditor({
  selectedSubject,
  isOpen,
  setNewSubject,
}) {
  const [loading, setLoading] = useState(false);
  const [subjectName, setSubjectName] = useState("");
  const [numLessonsPerGrade, setNumLessonsPerGrade] = useState([]);

  function getNumLessons(gradeId) {
    if (!selectedSubject?.numLessonsPerGrade) return 0;
    const el = selectedSubject.numLessonsPerGrade.find(
      (el) => el.grade.id === gradeId
    );
    return el?.numWeeklyLessons || 0;
  }

  async function getNames() {
    setLoading(true);
    try {
      const gradeApi = new GradeAPI(requester);
      const response = await gradeApi.getNames();
      setNumLessonsPerGrade(
        response.map((el) => ({
          ...el,
          numWeeklyLessons: getNumLessons(el.id),
        }))
      );
      setSubjectName(selectedSubject?.name || "");
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (isOpen) getNames();
  }, [selectedSubject]);

  useEffect(() => {
    setNewSubject({
      name: subjectName,
      numLessonsPerGrade,
    });
  }, [subjectName]);

  const handleChange = (e, gradeId) => {
    setNumLessonsPerGrade((currNumLessonsPerGrade) => {
      const newObj = [...currNumLessonsPerGrade];
      const curr = newObj.find((el) => el.id === gradeId);
      curr.numWeeklyLessons = Math.max(0, Number(e.target.value));
      return newObj;
    });
  };

  return (
    <WaitLoading loading={loading}>
      <TextField
        autoFocus
        margin="dense"
        id="subjectName"
        label="Nome da Disciplina"
        type="text"
        fullWidth
        value={subjectName}
        onChange={(e) => setSubjectName(e.target.value)}
        required
      />
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ width: "50%" }}>
                Série
              </TableCell>
              <TableCell align="center" sx={{ width: "50%" }}>
                Número de aulas por semana
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {numLessonsPerGrade.map((grade) => (
              <TableRow key={grade.id}>
                <TableCell align="center" sx={{ width: "50%" }}>
                  {grade.name}
                </TableCell>
                <TableCell sx={{ width: "50%" }}>
                  <TextField
                    type="number"
                    value={grade.numWeeklyLessons}
                    onChange={(e) => {
                      handleChange(e, grade.id);
                    }}
                    inputProps={{ min: 0 }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </WaitLoading>
  );
}
