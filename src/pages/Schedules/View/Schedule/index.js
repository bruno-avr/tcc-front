import { useEffect, useState } from "react";
import ScheduleAPI from "../../../../services/API/ScheduleAPI";
import WaitLoading from "../../../../components/WaitLoading";
import { toast } from "react-toastify";
import requester from "../../../../services/Requester/Requester";
import { Container } from "@mui/material";
import { useParams } from "react-router-dom";
import Footer from "../../Generate/Footer";
import Schedule from "../../Generate/Schedule";

const ViewSchedule = () => {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState([]);
  const [isFeasible, setIsFeasible] = useState(false);
  const [score, setScore] = useState(0);
  const [showTeachers, setShowTeachers] = useState(false);
  const [createdAt, setCreatedAt] = useState(null);
  const [metaheuristic, setMetaheuristic] = useState(null);

  async function getData() {
    setLoading(true);
    try {
      const scheduleApi = new ScheduleAPI(requester);
      const response = await scheduleApi.getSchedule(id);
      console.log(response);
      setIsFeasible(response?.isFeasible || false);
      setScore(response?.score || 0);
      setSchedules(response?.schedulesJSON || []);
      setCreatedAt(response?.createdAt || null);
      setMetaheuristic(response?.metaheuristic || null);
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
        {schedules.map((schedule, index) => (
          <Schedule
            key={index}
            schedule={schedule}
            showTeachers={showTeachers}
            fixed
          />
        ))}
      </Container>
      <Footer
        isFeasible={isFeasible}
        score={score}
        setShowTeachers={setShowTeachers}
        getData={getData}
        createdAt={createdAt}
        metaheuristic={metaheuristic}
      />
    </WaitLoading>
  );
};

export default ViewSchedule;
