export default class SubjectAPI {
  requester;

  constructor(requester) {
    this.requester = requester;
  }

  async getSubjects() {
    const response = await this.requester.get("/subject");
    if (response.status === 200) return response.data;
    throw new Error(response.data.errors);
  }

  async deleteSubject(id) {
    const response = await this.requester.delete("/subject/" + id);
    if (response.status === 200) return response.data;
    throw new Error(response.data.errors);
  }
}
