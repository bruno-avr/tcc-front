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

  async addClass({ section, grade, availableTimeSlots }) {
    const response = await this.requester.post("/class", {
      section,
      grade: {
        connect: {
          id: grade.id,
        },
      },
      availableTimeSlots,
    });
    if (response.status === 201) return response.data;
    throw new Error(response.data.errors);
  }

  async editClass(id, { section, grade, availableTimeSlots }) {
    const response = await this.requester.patch("/class/" + id, {
      section,
      grade: {
        connect: {
          id: grade.id,
        },
      },
      availableTimeSlots,
    });
    if (response.status === 200) return response.data;
    throw new Error(response.data.errors);
  }

  async deleteClass(id) {
    const response = await this.requester.delete("/class/" + id);
    if (response.status === 200) return response.data;
    throw new Error(response.data.errors);
  }
}
