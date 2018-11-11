import Client from "../client.js";

const mockResponse = (status, statusText, body) =>
  new window.Response(JSON.stringify(body), {
    status,
    statusText,
    headers: {
      "Content-Type": "application/json"
    }
  });

describe("client", () => {
  let client;
  const username = "tim";
  const password = "strongpassword";

  beforeEach(() => {
    client = new Client();
  });

  it("should not be logged in", () => {
    expect(client.isLoggedIn()).toBe(false);
  });

  it("should get memes", async () => {
    const mockData = {
      success: true,
      data: {
        memes: [
          {
            id: "61579",
            name: "One Does Not Simply",
            url: "http://i.imgflip.com/1bij.jpg",
            width: 568,
            height: 335
          },
          {
            id: "101470",
            name: "Ancient Aliens",
            url: "http://i.imgflip.com/26am.jpg",
            width: 500,
            height: 437
          }
        ]
      }
    };
    window.fetch = jest.fn(() =>
      Promise.resolve(mockResponse(200, "OK", mockData))
    );
    const memes = await client.getMemes();
    expect(window.fetch).toBeCalledTimes(1);
    expect(memes).toEqual(mockData.data.memes);
  });

  it("should not be able to caption image", async () => {
    expect.assertions(1);
    const config = {
      template_id: 61579,
      text0: "hello"
    };
    try {
      await client.captionImage(config);
    } catch (e) {
      expect(e).toBe(Client.ERR_LOGIN_REQUIRED);
    }
  });

  describe("when user logs in", () => {
    beforeEach(() => {
      client.login(username, password);
    });

    it("should save login in memory", () => {
      expect(client.credentials).toEqual({
        username,
        password
      });
    });

    it("should save login to localStorage", () => {
      const store = client.getStore();
      const { credentials } = store;
      expect(credentials).toEqual({ username, password });
    });

    it("should be logged in", () => {
      expect(client.isLoggedIn()).toBe(true);
    });

    describe("then caption image", () => {
      let mockData;

      beforeEach(() => {
        mockData = {
          success: true,
          data: {
            url: "http://i.imgflip.com/123abc.jpg",
            page_url: "https://imgflip.com/i/123abc"
          }
        };
        window.fetch = jest.fn(() => mockResponse(200, "OK", mockData));
      });

      it("with `text0/text1` param", async () => {
        const config = {
          template_id: 61579,
          text0: "hello"
        };
        const meme = await client.captionImage(config);
        expect(meme).toEqual(mockData.data);
      });

      it("with `boxes` param", async () => {
        const config = {
          template_id: 61579,
          boxes: [{ text: "hello", x: 10, y: 20 }]
        };
        const meme = await client.captionImage(config);
        expect(meme).toEqual(mockData.data);
      });
    });

    it("should not caption image without `template_id` param", async () => {
      expect.assertions(1);
      const config = { text0: "hello" };
      try {
        await client.captionImage(config);
      } catch (e) {
        expect(e).toEqual(Client.ERR_MISSING_TEMPLATE_ID);
      }
    });

    it("should not caption image without any `text0/text1` or `boxes` param", async () => {
      expect.assertions(1);
      const config = { template_id: 61579 };
      try {
        await client.captionImage(config);
      } catch (e) {
        expect(e).toEqual(Client.ERR_INVALID_TEXT);
      }
    });

    it("should not caption image if both `text0/text1` and `boxes` param supplied", async () => {
      expect.assertions(1);
      const config = {
        template_id: 61579,
        text0: "top text",
        boxes: [{ text: "hello", x: 10, y: 20 }]
      };
      try {
        await client.captionImage(config);
      } catch (e) {
        expect(e).toEqual(Client.ERR_INVALID_TEXT);
      }
    });

    describe("then user logs out", () => {
      it("should be logged out", () => {
        client.logout();
        expect(client.credentials).toBeNull();
      });
    });
  });

  describe("when user previously logged in", () => {
    it("should automatically have login info", () => {
      const credentials = { credentials: { username, password } };
      window.localStorage.setItem(
        Client.LOCAL_STORAGE_KEY,
        JSON.stringify(credentials)
      );
      client = new Client();
      expect(client.credentials).toEqual({ username, password });
    });
  });
});
