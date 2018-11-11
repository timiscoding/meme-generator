import "whatwg-fetch";
import { setConfig } from "react-hot-loader";

class Client {
  static LOCAL_STORAGE_KEY = "github.com/timiscoding/meme-generator";
  static GET_MEMES_ENDPOINT = "https://api.imgflip.com/get_memes";
  static CAPTION_IMAGE_ENDPOINT = "https://api.imgflip.com/caption_image";

  static ERR_LOGIN_REQUIRED = "Client error: login required";
  static ERR_MISSING_TEMPLATE_ID =
    "Client error: missing required param `template_id`";
  static ERR_INVALID_TEXT =
    "Client error: either `text0 and/or text1` or `boxes` param required";
  static ERR_UNEXPECTED_DATA = "Client error: unexpected json data structure";

  constructor() {
    const store = this.getStore();
    this.credentials = store.credentials;
  }

  login(username, password) {
    this.credentials = { username, password };
    this.saveStore("credentials", this.credentials);
  }

  logout() {
    this.credentials = null;
    this.saveStore("credentials", null);
  }

  isLoggedIn() {
    return !!this.credentials;
  }

  saveStore(key, value) {
    if (!window.localStorage) {
      return;
    }

    const store = this.getStore();
    store[key] = value;
    window.localStorage.setItem(
      Client.LOCAL_STORAGE_KEY,
      JSON.stringify(store)
    );
  }

  getStore() {
    if (!window.localStorage) {
      return;
    }

    const store = window.localStorage.getItem(Client.LOCAL_STORAGE_KEY);
    return store ? JSON.parse(store) : {};
  }

  async getMemes() {
    const response = await fetch(Client.GET_MEMES_ENDPOINT);
    if (!response.ok) {
      return Promise.reject(
        `Server error: ${response.status} ${response.statusText}`
      );
    }
    const json = await response.json();
    if (!json.success) {
      return Promise.reject(`API error: ${json.error_message}`);
    }
    if (!json.data || !json.data.memes) {
      return Promise.reject(Client.ERR_UNEXPECTED_DATA);
    }
    return json.data.memes;
  }

  async captionImage(params = {}) {
    const { template_id, text0, text1, font, max_font_size, boxes } = params;
    if (!this.isLoggedIn()) {
      return Promise.reject(Client.ERR_LOGIN_REQUIRED);
    }
    if (!template_id) {
      return Promise.reject(Client.ERR_MISSING_TEMPLATE_ID);
    }
    const isTopBottom = text0 || text1;
    const isOneOfTextChoices =
      (isTopBottom || boxes) && (!isTopBottom || !boxes);
    if (!isOneOfTextChoices) {
      return Promise.reject(Client.ERR_INVALID_TEXT);
    }

    params = { ...params, ...this.credentials };
    const data = new URLSearchParams();
    for (let [key, value] of Object.entries(params)) {
      data.append(key, value);
    }

    const response = await fetch(Client.CAPTION_IMAGE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: data.toString()
    });
    const json = await response.json();
    if (!json.success) {
      return Promise.reject(`API error: ${json.error_message}`);
    }
    return json.data;
  }
}

export default Client;
