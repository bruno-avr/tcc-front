export default class GradeAPI {
  requester;

  constructor(requester) {
    this.requester = requester;
  }

  async getGrades() {
    const response = await this.requester.get("/grade");
    if (response.status === 200) return response.data;
    throw new Error(response.data.errors);
  }

  async deleteGrade(id) {
    const response = await this.requester.delete("/grade/" + id);
    if (response.status === 200) return response.data;
    throw new Error(response.data.errors);
  }

  async addGrade(name) {
    const response = await this.requester.post("/grade", { name });
    if (response.status === 201) return response.data;
    throw new Error(response.data.errors);
  }

  async editGrade(id, name) {
    const response = await this.requester.patch("/grade/" + id, { name });
    if (response.status === 200) return response.data;
    throw new Error(response.data.errors);
  }
}
