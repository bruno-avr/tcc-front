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

  async getSubjectsPerClass() {
    const response = await this.requester.get("/subject/class");
    if (response.status === 200) return response.data;
    throw new Error(response.data.errors);
  }

  async deleteSubject(id) {
    const response = await this.requester.delete("/subject/" + id);
    if (response.status === 200) return response.data;
    throw new Error(response.data.errors);
  }

  async addSubject({ name, subjectsPerGrade }) {
    const response = await this.requester.post("/subject", {
      name,
      subjectsPerGrade: {
        create: subjectsPerGrade
          .filter((grade) => grade.numWeeklyLessons)
          .map((grade) => ({
            numWeeklyLessons: grade.numWeeklyLessons,
            grade: {
              connect: {
                id: grade.id,
              },
            },
          })),
      },
    });
    if (response.status === 201) return response.data;
    throw new Error(response.data.errors);
  }

  async editSubject(id, { name, subjectsPerGrade }) {
    const response = await this.requester.patch("/subject/" + id, {
      name,
      subjectsPerGrade: {
        create: subjectsPerGrade
          .filter((grade) => grade.numWeeklyLessons)
          .map((grade) => ({
            numWeeklyLessons: grade.numWeeklyLessons,
            grade: {
              connect: {
                id: grade.id,
              },
            },
          })),
      },
    });
    if (response.status === 200) return response.data;
    throw new Error(response.data.errors);
  }
}
