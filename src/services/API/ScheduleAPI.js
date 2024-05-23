export default class ScheduleAPI {
  requester;

  constructor(requester) {
    this.requester = requester;
  }

  async generateSchedule() {
    const response = await this.requester.post("/schedule/generate");
    if (response.status === 201) return response.data;
    throw new Error(response.data.errors);
  }

  async fixedRecalculation(defaultSchedule) {
    const response = await this.requester.post(
      "/schedule/fixed-recalculation",
      defaultSchedule
    );
    if (response.status === 201) return response.data;
    throw new Error(response.data.errors);
  }
}
