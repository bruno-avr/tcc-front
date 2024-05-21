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
  const [isFeasible, setIsFeasible] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showTeachers, setShowTeachers] = useState(false);

  async function getData() {
    setShowTeachers(false);
    setLoading(true);
    try {
      const scheduleApi = new ScheduleAPI(requester);
      const response = await scheduleApi.generateSchedule();
      setIsFeasible(response?.isFeasible || false);
      setScore(response?.score || 0);
      setSchedules(response?.schedules || []);
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <WaitLoading loading={loading}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {schedules.map((schedule) => (
          <Schedule schedule={schedule} showTeachers={showTeachers} />
        ))}
      </Container>
      <Footer
        isFeasible={isFeasible}
        score={score}
        setShowTeachers={setShowTeachers}
        getData={getData}
      />
    </WaitLoading>
  );
};

export default Generate;
