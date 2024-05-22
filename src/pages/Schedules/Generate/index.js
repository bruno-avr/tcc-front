import { useEffect, useState } from "react";
import ScheduleAPI from "../../../services/API/ScheduleAPI";
import WaitLoading from "../../../components/WaitLoading";
import Footer from "./Footer";
import { toast } from "react-toastify";
import requester from "../../../services/Requester/Requester";
import { Container } from "@mui/material";
import Schedule from "./Schedule";

const Generate = () => {
  const [schedules, setSchedules] = useState([]);
  const [schedulesStr, setSchedulesStr] = useState(null);
  const [isFeasible, setIsFeasible] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showTeachers, setShowTeachers] = useState(false);
  const [draggedLesson, setDraggedLesson] = useState(null);
  const [changesDetected, setChangesDetected] = useState(false);

  async function getData() {
    setShowTeachers(false);
    setLoading(true);
    try {
      const scheduleApi = new ScheduleAPI(requester);
      const response = await scheduleApi.generateSchedule();
      setIsFeasible(response?.isFeasible || false);
      setScore(response?.score || 0);
      setSchedules(response?.schedules || []);
      setSchedulesStr(JSON.stringify(response?.schedules || []));
      setChangesDetected(false);
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    getData();
  }, []);

  function swapLessons(index, lesson1, lesson2) {
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
    setSchedules(JSON.parse(schedulesStr));
    setChangesDetected(false);
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
      />
    </WaitLoading>
  );
};

export default Generate;
