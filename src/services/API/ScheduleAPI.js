export default class ScheduleAPI {
  requester;

  constructor(requester) {
    this.requester = requester;
  }

  async generateSchedule() {
    const response = await this.requester.get("/schedule/generate");
    if (response.status === 200) return response.data;
    throw new Error(response.data.errors);
  }
}
