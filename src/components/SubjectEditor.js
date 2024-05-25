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
  Checkbox,
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
  const [loading, setLoading] = useState(true);
  const [subjectName, setSubjectName] = useState("");
  const [subjectsPerGrade, setSubjectsPerGrade] = useState([]);

  function getNumLessons(gradeId) {
    if (!selectedSubject?.subjectsPerGrade) return 0;
    const el = selectedSubject.subjectsPerGrade.find(
      (el) => el.grade.id === gradeId
    );
    return el?.numWeeklyLessons || 0;
  }

  async function getNames() {
    setLoading(true);
    try {
      const gradeApi = new GradeAPI(requester);
      const response = await gradeApi.getNames();
      setSubjectsPerGrade(
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
      subjectsPerGrade,
    });
  }, [subjectName, subjectsPerGrade]);

  const handleChange = (value, gradeId) => {
    setSubjectsPerGrade((currNumLessonsPerGrade) => {
      const newObj = [...currNumLessonsPerGrade];
      const curr = newObj.find((el) => el.id === gradeId);
      curr.numWeeklyLessons = Math.max(0, Number(value));
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
      <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ width: "10%" }}>
                #
              </TableCell>
              <TableCell align="center" sx={{ width: "45%" }}>
                Série
              </TableCell>
              <TableCell align="center" sx={{ width: "45%" }}>
                Número de aulas por semana
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subjectsPerGrade.map((grade) => (
              <TableRow selected={grade.numWeeklyLessons} key={grade.id}>
                <TableCell align="center" sx={{ width: "10%" }}>
                  <Checkbox
                    color="primary"
                    checked={grade.numWeeklyLessons}
                    onClick={() => {
                      handleChange(grade.numWeeklyLessons ? 0 : 1, grade.id);
                    }}
                  />
                </TableCell>
                <TableCell align="center" sx={{ width: "45%" }}>
                  {grade.name}
                </TableCell>
                <TableCell sx={{ width: "45%" }}>
                  <TextField
                    type="number"
                    value={grade.numWeeklyLessons}
                    onChange={(e) => {
                      handleChange(e.target.value, grade.id);
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
