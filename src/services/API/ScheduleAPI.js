export default class ScheduleAPI {
  requester;

  constructor(requester) {
    this.requester = requester;
  }

  async generateSchedule(metaheuristic) {
    const response = await this.requester.post(
      "/schedule/generate/" + metaheuristic
    );
    if (response.status === 201) return response.data;
    throw new Error(response.data.errors);
  }

  async fixedRecalculation(metaheuristic, defaultSchedule) {
    const response = await this.requester.post(
      "/schedule/fixed-recalculation/" + metaheuristic,
      defaultSchedule
    );
    if (response.status === 201) return response.data;
    throw new Error(response.data.errors);
  }

  async calculateScore(defaultSchedule) {
    const response = await this.requester.post(
      "/schedule/calculate-score",
      defaultSchedule
    );
    if (response.status === 201) return response.data;
    throw new Error(response.data.errors);
  }

  async saveSchedule(data) {
    const response = await this.requester.post("/schedule/save", data);
    if (response.status === 201) return response.data;
    throw new Error(response.data.errors);
  }

  async getSchedules() {
    const response = await this.requester.get("/schedule");
    if (response.status === 200) return response.data;
    throw new Error(response.data.errors);
  }

  async getSchedule(id) {
    const response = await this.requester.get(`/schedule/${id}`);
    if (response.status === 200) return response.data;
    throw new Error(response.data.errors);
  }
}
