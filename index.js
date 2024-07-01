const Joi = require("joi");
require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 2005;
app.use(express.json());
app.listen(port, () => {
  console.log(`WeBlog is running on port ${port}`);
});

let users = [
  {
    id: 1,
    username: "Sherifat001",
    email: "pelumioshoala@gmail.com",
    phone: "+2348156789856",
  },

  {
    id: 2,
    username: "Jay001",
    email: "jay@gmail.com",
    phone: "+2348056789856",
  },
];

let articles = [
  {
    id: 101,
    title: "Nigeria, my country!",
    description: "An article that explores the ordeals of Nigeria...",
    category: "Governance",
    body: "No food, no money, no fuel, yen yen yen...",
    username: "Sherifat001",
  },

  {
    id: 102,
    title: "What Britain did to Nigeria",
    description: "An article that explains the colonization of Nigeria...",
    category: "Governance",
    body: "They claim to have helped but situation has only worsened",
    username: "Jay001",
  },

  {
    id: 103,
    title: "Trials of a programmer in Nigeria",
    description: "...explores the ordeals of a programmer in the Nigerian Tech industry",
    category: "Non-fiction",
    body: "They claim to have helped but situation has only worsened",
    username: "Sherifat001",
  },
];

let categories = [
  {
    id: 1,
    name: "Governance",
    description: "state of the nation",
  },
  {
    id: 2,
    name: "Fiction",
    description: "...includes romance, sci-fi, comics, crime etc.",
  },

  {
    id: 3,
    name: "Non-fiction",
    description:
      "...includes biography, autobiography, history, self help etc.",
  },
  {
    id: 4,
    name: "General",
    description: "for non-categorized books",
  },
];

const authentication = (req, res, next) => {
    let auth = true
    if(auth) next()
    else{
res.status(401).json({
    success: false,
    message: "user is unauthorized!"
})}
}

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to SheBlogs!",
  });
});

app.post("/users", authentication, (req, res) => {
  const { username, email, phone } = req.body;
  try {
    const validateUserSchema = Joi.object({
      username: Joi.string().min(3).required().messages({
        "string.empty": `"username" cannot be empty`,
        "string.min": `"username" should have a minimum length of {#limit}`,
        "any.required": `"username" field is required`,
      }),

      email: Joi.string().required().messages({
        "string.empty": `"email" cannot be empty`,
        "any.required": `"email" field is required`,
      }),

      phone: Joi.string().required().messages({
        "string.empty": `"phone" cannot be empty`,
        "any.required": `"phone" field is required`,
      }),
    });
    const { error, value } = validateUserSchema.validate(req.body);
    if (error) throw new Error(error.details[0].message);

    if (
      users.find(
        (user) => user.username.toLowerCase() == username.toLowerCase()
      )
    )
      throw new Error("username exists");
    if (users.find((user) => user.email.toLowerCase() == email.toLowerCase()))
      throw new Error("email exists");
    if (users.find((user) => user.phone == phone))
      throw new Error("phone exists");

    const newUser = {
      id: users.length + 1,
      ...req.body,
    };

    users.push(newUser);
    res.status(201).json({
      success: true,
      message: `Welcome to WeBlog ${username}!`,
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/user/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const findUser = users.find((user) => user.id == id);
    if (!findUser) throw new Error(`This user doesn't exist`);

    res.status(200).json({
      success: true,
      message: `Here's ${findUser.username} profile!`,
      data: findUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.patch("/user/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { username, email, phone } = req.body;
    let findUser = users.find((user) => user.id == id);
    if (!findUser) throw new Error(`This user doesn't exist!`);
    let oldUsername = findUser.username;

    findUser.username = username || findUser.username;
    findUser.email = email || findUser.email;
    findUser.phone = phone || findUser.phone;

    res.status(200).json({
      success: true,
      message: `${oldUsername} profile info updated successfully!`,
      data: findUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.delete("/user/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    let findUser = users.findIndex((user) => user.id == id);
    let userDeets = users[findUser];
    if (findUser == -1) throw new Error(`This user doesn't exist!`);
    console.log(findUser);
    if (
      articles.find(
        (article) =>
          article.username.toLowerCase() == userDeets.username.toLowerCase()
      )
    ) {
      throw new Error("This user has published articles");
    }
    users.splice(findUser, 1);
    res.status(200).json({
      success: true,
      message: `${userDeets.username} account deleted successfully!`,
      data: userDeets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.post("/articles", (req, res) => {
  const { title, description, body, username, category } = req.body;
  try {
    const validateArticleSchema = Joi.object({
      title: Joi.string().min(10).max(50).required().messages({
        "string.empty": `"title" cannot be empty!`,
        "string.min": `"title" requires a min length of {#limit}!`,
        "string.max": `"title" length cannot be more than {#limit}`,
        "any.required": `"title" field is required!`,
      }),
      description: Joi.string().min(10).max(75).required().messages({
        "string.empty": `"description" cannot be empty!`,
        "string.min": `"description" requires a min length of {#limit}!`,
        "string.max": `"description" length cannot be more than {#limit}`,
        "any.required": `"description" field is required!`,
      }),
      body: Joi.string().min(10).max(500).required().messages({
        "string.empty": `"body" cannot be empty!`,
        "string.min": `"body" requires a min length of {#limit}!`,
        "string.max": `"body" length cannot be more than {#limit}`,
        "any.required": `"body" field is required!`,
      }),
      username: Joi.string().required().messages({
        "string.empty": `"username" cannot be empty!`,
        "any.required": `"username" field required!`,
      }),
      category: Joi.string().optional().messages({
        "string.empty": `"category" cannot be empty!`,
      }),
    });
    const { error, value } = validateArticleSchema.validate(req.body);
    if (error) throw new Error(error.details[0].message);

    const checkUsername = users.find(
      (user) => user.username.toLowerCase() == username.toLowerCase()
    );
    if (!checkUsername)
      throw new Error(`This user doesn't exist, please enter an existing user`);

    if (category) {
      const checkCategory = categories.find(
        (categ) => categ.name.toLowerCase() == category.toLowerCase()
      );
      if (!checkCategory) throw new Error("This category does not exist!");
    }
    if (
      articles.find(
        (article) =>
          article.title.toLowerCase() == title.toLowerCase() ||
          article.description.toLowerCase() == description.toLowerCase() ||
          article.body.toLowerCase() == body.toLowerCase()
      )
    ) {
      throw new Error("Article already exists!");
    }
    const newArticle = {
      id: articles.length + 1,
      title,
      description,
      category: category || "General",
      body,
      username,
    };
    articles.push(newArticle);
    res.status(201).json({
      success: true,
      message: `New article titled: ${title} successfully added by ${username}!`,
      data: newArticle,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/articles", (req, res) => {
  let {filter, category} = req.query

  let data = articles.sort((a, b) => (a.id > b.id ? 1 : -1))
  try {
    if (category) {
      category = category.toLowerCase();
      if (
        category != "general" &&
        category != "governance" &&
        category != "fiction" &&
        category != "non-fiction"
      )
        throw new Error("No such category!");
      data = articles.filter(
        (article) => article.category.toLowerCase() == category
      );
      if (data.length == 0) {
        return res.status(200).json({
          success: true,
          message: `There's currently no article in this category`,
        });
      }
    }
    if (filter){
        filter = filter.toLowerCase()
        if(filter != "title" && filter != "description" && filter != "username") throw new Error ('No such filter!')
        if(filter == "title") data = data.sort((a, b) => (a.title > b.title ? -1 : 1))
        if(filter == "description") data = data.sort((a, b) => (a.description > b.description ? 1 : -1))
        if(filter == "username") data = data.sort((a, b) => (a.username > b.username ? 1 : -1))
      }
    res.status(200).json({
      success: true,
      message: `Articles fetched successfully!`,
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/article/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const findArticle = articles.find((article) => article.id == id);
    if (!findArticle) throw new Error(`This article doesn't exist`);

    res.status(200).json({
      success: true,
      message: `${findArticle.title} fetched successfully!`,
      data: findArticle,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.patch("/article/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, description, body, username } = req.body;
    let findArticle = articles.find((article) => article.id == id);
    if (!findArticle) throw new Error(`This article doesn't exist!`);
    let oldTitle = findArticle.title;

    findArticle.title = title || findArticle.title;
    findArticle.description = description || findArticle.description;
    findArticle.body = body || findArticle.body;
    findArticle.username = username || findArticle.username;

    res.status(200).json({
      success: true,
      message: `${oldTitle} updated successfully!`,
      data: findArticle,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.delete("/article/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    let articleIndex = articles.findIndex((article) => article.id == id);
    let article = articles[articleIndex];
    if (articleIndex == -1) throw new Error(`This article doesn't exist!`);
    console.log(articleIndex);
    articles.splice(articleIndex, 1);
    res.status(200).json({
      success: true,
      message: `${article.title} with ID: ${article.id} deleted successfully!`,
      data: article,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.post("/categories", (req, res) => {
  const { name, description } = req.body;
  try {
    const validateCategorySchema = Joi.object({
      name: Joi.string().min(5).max(25).required().messages({
        "string.empty": `"name" cannot be empty!`,
        "string.min": `"name" requires a min length of {#limit}!`,
        "string.max": `"name" length cannot be more than {#limit}`,
        "any.required": `"name" field is required!`,
      }),
      description: Joi.string().min(10).max(75).required().messages({
        "string.empty": `"description" cannot be empty!`,
        "string.min": `"description" requires a min length of {#limit}!`,
        "string.max": `"description" length cannot be more than {#limit}`,
        "any.required": `"description" cannot be empty!`,
      }),
    });
    const { error, value } = validateCategorySchema.validate(req.body);
    if (error) throw new Error(error.details[0].message);
    if (
      categories.find(
        (category) =>
          category.name.toLowerCase() == name.toLowerCase() ||
          category.description.toLowerCase() == description.toLowerCase()
      )
    ) {
      throw new Error("category already exists!");
    }

    const newCategory = {
      id: categories.length + 1,
      ...req.body,
    };
    categories.push(newCategory);
    res.status(201).json({
      success: true,
      message: `New category named: ${name} successfully added!`,
      data: newCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/categories", (req, res) => {
  let order = req.query.filter;
  let result = categories.sort((a, b) => (a.id > b.id ? 1 : -1));
  try {
    if (order) {
      order = order.toLowerCase();
      if (order != "name" && order != "description")
        throw new Error("No such filter");
      if (order == "name")
        result = categories.sort((a, b) => (a.name > b.name ? 1 : -1));
      if (order == "description")
        result = categories.sort((a, b) =>
          a.description > b.description ? 1 : -1
        );
    }
    res.status(200).json({
      success: true,
      message: `Here's a list of all categories!`,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.patch("/category/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, description } = req.body;
    let findCategory = categories.find((category) => category.id == id);
    if (!findCategory) throw new Error(`This category doesn't exist!`);
    let oldCategory = findCategory.name;

    findCategory.name = name || findCategory.name;
    findCategory.description = description || findCategory.description;

    for (let i = 0; i < articles.length; i++) {
      if (articles[i].category.toLowerCase() == oldCategory.toLowerCase()) {
        articles[i].category = name || articles[i].category;
      }
    }
    res.status(200).json({
      success: true,
      message: `${oldCategory} updated successfully!`,
      data: findCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.delete("/category/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    let categoryIndex = categories.findIndex((category) => category.id == id);
    let category = categories[categoryIndex];
    if (categoryIndex == -1) throw new Error(`This category doesn't exist!`);
    categories.splice(categoryIndex, 1);

    for (let i = 0; i < articles.length; i++) {
      if (articles[i].category.toLowerCase() == category.name.toLowerCase()) {
        articles[i].category = "General";
      }
    }
    res.status(200).json({
      success: true,
      message: `${category.name} with ID: ${category.id} deleted successfully!`,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
