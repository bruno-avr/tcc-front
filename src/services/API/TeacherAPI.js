export default class TeacherAPI {
  requester;

  constructor(requester) {
    this.requester = requester;
  }

  async getTeachers() {
    const response = await this.requester.get("/teacher");
    if (response.status === 200) return response.data;
    throw new Error(response.data.errors);
  }
}
