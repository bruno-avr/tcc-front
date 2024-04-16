export default class ClassAPI {
  requester;

  constructor(requester) {
    this.requester = requester;
  }

  async getClasses() {
    const response = await this.requester.get("/class");
    if (response.status === 200) return response.data;
    throw new Error(response.data.errors);
  }
}
