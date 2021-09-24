import axios from "axios";

const BASE_URL= process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class Api {
  static token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTYzMjQxODY1NH0.DH7r7dHwTuCTLGGBLOncca4mTAOXjbPKl6BtNutiz50";
  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization : `Bearer ${Api.token}`};
    const params = (method === "get") ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } 
    catch(e) {
      console.error("API Error:", e.response);
      const message = e.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  static async register(data) {
    const res = await this.request(`auth/register`, data, "post");
    return res.token;
  }

  static async login(data) {
    const res = await this.request(`auth/token`, data, "post");
    return res.token;
  }

  static async getCurrentUser(username) {
    const res = await this.request(`users/${username}`);
    return res.user;
  }

  static async sendMessage(currentUsername, toUsername, data) {
    const res = await this.request(`messages/${currentUsername}/to/${toUsername}`, data, "POST");
    return res.message;
  }

  static async createCalendarEvent(currentUsername, data) {
    const res = await this.request(`calendar-events/${currentUsername}`, data, "post");
    return res.event;
  }

  static async getUserCalendarEvents(currentUsername) {
    const res = await this.request(`calendar-events/${currentUsername}`);
    return res.events;
  }
  
}

export default Api;