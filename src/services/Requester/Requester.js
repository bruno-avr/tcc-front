import axios from "axios";

class Requester {
  requester;

  constructor(token) {
    this.requester = axios.create({
      baseURL: "http://localhost:3333/",
      headers: {
        Authorization: token || "",
      },
      validateStatus: () => true,
    });
  }

  post(url, data) {
    return this.awaitResponse(this.requester.post(url, data));
  }

  put(url, data) {
    return this.awaitResponse(this.requester.put(url, data));
  }

  get(url, params = {}) {
    return this.awaitResponse(this.requester.get(url, { params }));
  }

  delete(url) {
    return this.awaitResponse(this.requester.delete(url));
  }

  async awaitResponse(request) {
    return await request;
  }
}

const requester = new Requester();

export default requester;
