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

  async getPriorities() {
    const response = await this.requester.get("/teacher/priorities");
    if (response.status === 200) return response.data;
    throw new Error(response.data.errors);
  }

  async addTeacher({ name, classes }) {
    const response = await this.requester.post("/teacher", {
      name,
      subjectsPerClass: {
        create: classes.map((_class) => ({
          class: {
            connect: {
              id: _class.id,
            },
          },
          subjectPerGrade: {
            connect: {
              id: _class.subjectPerGradeId,
            },
          },
        })),
      },
    });
    if (response.status === 201) return response.data;
    throw new Error(response.data.errors);
  }

  async editTeacher(id, { name, classes }) {
    const response = await this.requester.patch("/teacher/" + id, {
      name,
      subjectsPerClass: {
        create: classes.map((_class) => ({
          class: {
            connect: {
              id: _class.id,
            },
          },
          subjectPerGrade: {
            connect: {
              id: _class.subjectPerGradeId,
            },
          },
        })),
      },
    });
    if (response.status === 200) return response.data;
    throw new Error(response.data.errors);
  }

  async deleteTeacher(id) {
    const response = await this.requester.delete("/teacher/" + id);
    if (response.status === 200) return response.data;
    throw new Error(response.data.errors);
  }
}
