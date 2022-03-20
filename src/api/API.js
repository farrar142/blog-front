import React, { Component, useEffect, useState } from "react";
import axios from "axios";
import {} from "../Atom";
import { useRecoilState, useRecoilValue } from "recoil";
const base_url = "https://blog.honeycombpizza.link";
async function post(api, data = {}) {
  return await axios.post(api, data);
}
async function get(api, data = {}) {
  return axios.get(api, data);
}
// auth().Signin().result
class Auth {
  access_token;
  login = async (id, pw) => {
    const signinUrl = "/api/signin/";
    return await post(signinUrl, {
      username: id,
      password: pw,
    })
      .then((res) => {
        const result = res.data[0];
        this.set(result);
        return result;
      })
      .catch((error) => false);
  };
  signup = async (id, em, pw) => {
    const signupUrl = "/api/signup/";
    return await post(signupUrl, {
      username: id,
      email: em,
      password: pw,
    })
      .then((res) => {
        return true;
      })
      .catch(() => {
        return false;
      });
  };

  get_info = async (token) => {
    const infoUrl = "/api/userinfo/";
    return await post(infoUrl, {
      token: token.token,
    })
      .then((res) => {
        const result = res.data[0];
        return result;
      })
      .catch((error) => false);
  };
  logout = () => {};
  set(token) {
    this.access_token = token;
  }
}
class BlogApi {
  get_tags = async (id) => {
    const url = `/api/blogs/${id}/tags`;
    return await get(url)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        return [];
      });
  };
  get_blog_by_id = async (id) => {
    const url = `/api/blog/${id}`;
    return await get(url)
      .then((res) => {
        return res.data[0];
      })
      .catch(() => {
        return {};
      });
  };
  get_blog_articles = async (id, tagName = "") => {
    const url = `/api/articles/${id}?tagName=${tagName}`;
    if (id) {
      return await get(url)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          return [];
        });
    } else {
      return [];
    }
  };
  get_main_articles = async (tagName = "") => {
    const url = `/api/articles/random?tag=${tagName}`;
    return await get(url, { tag: tagName })
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        return [];
      });
  };
  get_article_by_id = async (id) => {
    const url = `/api/article/${id}`;
    return await get(url)
      .then((res) => {
        return res.data[0];
      })
      .catch(() => {
        return {};
      });
  };
  delete_article_by_id = async (id, token) => {
    const url = `/api/article/${id}/delete`;
    return await post(url, { token: token.token })
      .then((res) => {
        return true;
      })
      .catch(() => {
        return false;
      });
  };
  post_article = async (
    title,
    tags,
    context,
    token,
    articleId = 0,
    action = "write"
  ) => {
    const url = `/api/article/${articleId}/edit?action=${action}`;
    const data = {
      token: token.token,
      title: title,
      tags: tags,
      context: context,
    };

    return await post(url, data)
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  };
}
class CLI {
  cli = async (
    token,
    hostname,
    username,
    password,
    directory,
    cmd = "",
    port = 22
  ) => {
    const data = {
      token: token.token,
      hostname,
      username,
      password,
      directory,
      cmd,
      port,
    };
    // console.log(data);
    const url = "/cliserver/get";
    return await post(url, data)
      .then((res) => {
        return res.data[0];
      })
      .catch(() => {
        return [];
      });
  };
}
export default new Auth();
export const Blog = new BlogApi();
export const Cli = new CLI();
