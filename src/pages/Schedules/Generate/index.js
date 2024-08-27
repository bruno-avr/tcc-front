import { useEffect, useState } from "react";
import ScheduleAPI from "../../../services/API/ScheduleAPI";
import WaitLoading from "../../../components/WaitLoading";
import Footer from "./Footer";
import { toast } from "react-toastify";
import requester from "../../../services/Requester/Requester";
import { Box, Button, Container } from "@mui/material";
import Schedule from "./Schedule";
import { useNavigate } from "react-router-dom";

const Generate = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [schedulesStr, setSchedulesStr] = useState(null);
  const [isFeasible, setIsFeasible] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingScore, setLoadingScore] = useState(false);
  const [showTeachers, setShowTeachers] = useState(false);
  const [draggedLesson, setDraggedLesson] = useState(null);
  const [changesDetected, setChangesDetected] = useState(false);
  const [metaheuristic, setMetaheuristic] = useState("simulatedAnnealing");
  const [executionSpeed, setExecutionSpeed] = useState("fast");

  function checkLoadingScore() {
    if (loadingScore) return true;
    return false;
  }

  async function saveSchedule() {
    if (checkLoadingScore()) return;
    setLoading(true);
    try {
      const processedSchedules = schedules.map((schedule) => ({
        ...schedule,
        lessons: schedule.lessons.map((lesson) => {
          delete lesson.isSelected;
          return lesson;
        }),
      }));
      const data = {
        metaheuristic,
        schedules: processedSchedules,
      };
      data.isFeasible = isFeasible;
      if (isFeasible) data.score = score;
      const scheduleApi = new ScheduleAPI(requester);
      await scheduleApi.saveSchedule(data);
      toast.success("Horário salvo com sucesso.");
      navigate("/schedules/view");
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  }

  async function getData() {
    if (checkLoadingScore()) return;
    setShowTeachers(false);
    setLoading(true);
    try {
      const scheduleApi = new ScheduleAPI(requester);
      const response = await scheduleApi.generateSchedule(metaheuristic, executionSpeed);
      setIsFeasible(response?.isFeasible || false);
      setScore(response?.score || 0);
      setSchedules(response?.schedules || []);
      setSchedulesStr(JSON.stringify(response));
      setChangesDetected(false);
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  }

  function processSchedule(schedulesAux, handleFixed) {
    const fixedSchedule = {};
    schedulesAux.forEach((schedule) => {
      fixedSchedule[schedule.classId] = {};
      schedule.lessons.forEach((lesson) => {
        fixedSchedule[schedule.classId][lesson.startingTime] = {};
        const fixedScheduleLesson =
          fixedSchedule[schedule.classId][lesson.startingTime];

        if (lesson.empty) fixedScheduleLesson.subjectId = "EMPTY";
        else fixedScheduleLesson.subjectId = lesson.subject.id;

        if (lesson.empty || !lesson.teacher)
          fixedScheduleLesson.teacherId = "EMPTY";
        else fixedScheduleLesson.teacherId = lesson.teacher.id;

        if (handleFixed) {
          fixedScheduleLesson.isFixed = lesson.isSelected ? 1 : 0;
        }
      });
    });
    return fixedSchedule;
  }

  async function fixedRecalculation() {
    if (checkLoadingScore()) return;
    const processedSchedule = processSchedule(schedules, true);
    setShowTeachers(false);
    setLoading(true);
    try {
      const scheduleApi = new ScheduleAPI(requester);
      const response = await scheduleApi.fixedRecalculation(
        metaheuristic,
        processedSchedule
      );
      setIsFeasible(response?.isFeasible || false);
      setScore(response?.score || 0);
      setSchedules(response?.schedules || []);
      console.log(response.schedules);

      const duplicate = JSON.parse(JSON.stringify(response?.schedules || []));
      duplicate.forEach((s) => s.lessons.forEach((l) => delete l.isSelected));
      setSchedulesStr(JSON.stringify({ ...response, schedules: duplicate }));

      setChangesDetected(false);
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  }

  async function calculateScore(schedulesAux) {
    const processedSchedule = processSchedule(schedulesAux);
    setLoadingScore(true);
    try {
      const scheduleApi = new ScheduleAPI(requester);
      const response = await scheduleApi.calculateScore(processedSchedule);
      setIsFeasible(response?.isFeasible || false);
      setScore(response?.score || 0);
    } catch (error) {
      toast.error(error.message);
    }
    setLoadingScore(false);
  }

  useEffect(() => {
    getData();
  }, [metaheuristic]);

  async function swapLessons(index, lesson1, lesson2) {
    if (checkLoadingScore()) return;
    setChangesDetected(true);
    const newSchedules = [...schedules];
    const lessons = newSchedules[index].lessons;
    const i = lessons.findIndex((l) => l.startingTime === lesson1.startingTime);
    const j = lessons.findIndex((l) => l.startingTime === lesson2.startingTime);
    const copy = { ...lessons[i] };
    lessons[i] = { ...lessons[j], startingTime: lessons[i].startingTime };
    lessons[j] = { ...copy, startingTime: lessons[j].startingTime };
    delete lessons[i].isSelected;
    delete lessons[j].isSelected;
    setSchedules(newSchedules);
    await calculateScore(newSchedules);
  }

  function selectLesson(index, lesson) {
    const newSchedules = [...schedules];
    const lessons = newSchedules[index].lessons;
    const i = lessons.findIndex((l) => l.startingTime === lesson.startingTime);
    if (lessons[i].isSelected) delete lessons[i].isSelected;
    else lessons[i].isSelected = true;
    setSchedules(newSchedules);
  }

  function resetToDefault() {
    if (checkLoadingScore()) return;
    const obj = JSON.parse(schedulesStr);
    setIsFeasible(obj?.isFeasible || false);
    setScore(obj?.score || 0);
    setSchedules(obj?.schedules || []);
    setChangesDetected(false);
  }

  function changeMetaheuristic(aux) {
    if (checkLoadingScore()) return;
    setMetaheuristic(aux);
  }

  function changeExecutionSpeed(aux) {
    if (checkLoadingScore()) return;
    setExecutionSpeed(aux);
  }

  function hasSelectedCells() {
    if (
      schedules.find((schedule) =>
        schedule.lessons.find((lesson) => lesson.isSelected)
      )
    )
      return true;
    return false;
  }

  return (
    <>
    <WaitLoading loading={loading}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {schedules.map((schedule, index) => (
          <Schedule
            schedule={schedule}
            showTeachers={showTeachers}
            draggedLesson={draggedLesson}
            setDraggedLesson={setDraggedLesson}
            swapLessons={(lesson1, lesson2) =>
              swapLessons(index, lesson1, lesson2)
            }
            selectLesson={(lesson) => selectLesson(index, lesson)}
          />
        ))}
      </Container>
      <Footer
        isFeasible={isFeasible}
        score={score}
        setShowTeachers={setShowTeachers}
        getData={getData}
        changesDetected={changesDetected}
        hasSelectedCells={hasSelectedCells()}
        resetToDefault={resetToDefault}
        fixedRecalculation={fixedRecalculation}
        saveSchedule={saveSchedule}
        setMetaheuristic={changeMetaheuristic}
        executionSpeed={executionSpeed}
        setExecutionSpeed={changeExecutionSpeed}
        metaheuristic={metaheuristic}
        loadingScore={loadingScore}
      />
    </WaitLoading>
    {!!loading && executionSpeed !== "fast" && (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Button
          variant="text"
          color="primary"
          onClick={() => {
            navigate("/schedules");
          }}
        >
          Cancelar
        </Button>
      </Box>
    )}
    </>
  );
};

export default Generate;
