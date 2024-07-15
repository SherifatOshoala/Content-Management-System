const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const mysql = require("mysql2");
const Joi = require("joi");
const express = require("express");
const app = express();
const port = process.env.PORT || 2005;
app.use(express.json());

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.DB_USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT,
});

connection.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Content_MS Database connected!");
    app.listen(port, () => {
      console.log(`WeBlog is running on port ${port}`);
    });
  }
});

//     id: 1,
//     username: "Sherifat001",
//     email: "pelumioshoala@gmail.com",
//     phone: "+2348156789856",
//   },

//   {
//     id: 2,
//     username: "Jay001",
//     email: "jay@gmail.com",
//     phone: "+2348056789856",
//   },
// ];

// let articles = [
//   {
//     id: 101,
//     title: "Nigeria, my country!",
//     description: "An article that explores the ordeals of Nigeria...",
//     category: "Governance",
//     body: "No food, no money, no fuel, yen yen yen...",
//     username: "Sherifat001",
//   },

//   {
//     id: 102,
//     title: "What Britain did to Nigeria",
//     description: "An article that explains the colonization of Nigeria...",
//     category: "Governance",
//     body: "They claim to have helped but situation has only worsened",
//     username: "Jay001",
//   },

  // {
  //   id: 103,
  //   title: "Trials of a programmer in Nigeria",
  //   description:
  //     "...explores the ordeals of a programmer in the Nigerian Tech industry",
  //   category: "Non-fiction",
  //   body: "They claim to have helped but situation has only worsened",
  //   username: "Sherifat001",
  // },
// ];

// let categories = [
//   {
//     id: 1,
//     name: "Governance",
//     description: "state of the nation",
//   },
//   {
//     id: 2,
//     name: "Fiction",
//     description: "...includes romance, sci-fi, comics, crime etc.",
//   },

//   {
//     id: 3,
//     name: "Non-fiction",
//     description:
//       "...includes biography, autobiography, history, self help etc.",
//   },
//   {
//     id: 4,
//     name: "General",
//     description: "for non-categorized books",
//   },
// ];

const authentication = (req, res, next) => {
  let auth = true;
  if (auth) next();
  else {
    res.status(401).json({
      success: false,
      message: "user is unauthorized!",
    });
  }
};

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
    connection.query(
      {
        sql: `INSERT into users (user_id, username, email, phone) VALUES(?,?,?,?)`,
        values: [uuidv4(), username, email, phone],
      },
      (error, result) => {
        try {
          if (error) {
            throw new Error(error);
          } else {
            res.status(201).json({
              success: true,
              message: `Welcome to WeBlog ${username}!`,
              data: result,
            });
          }
        } catch (error) {
          res.status(500).json({
            status: true,
            message: error.message,
          });
        }
      }
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/user/:id", (req, res) => {
  try {
    const id = req.params.id;

    connection.query(
      {
        sql: "SELECT USERS.*, ARTICLES.title FROM USERS JOIN ARTICLES ON USERS.username = ARTICLES.username WHERE USERS.user_id = ? ",
        values: [id],
      },
      (error, result) => {
        try {
          if (result.length == 0) {
            throw new Error("No such id");
          }
          if (error) {
            throw new Error(error);
          } else {
            delete result[0].user_id;
            res.status(200).json({
              success: true,
              message: `Here's your profile!`,
              data: result[0],
            });
          }
        } catch (error) {
          res.status(500).json({
            status: false,
            message: error.message,
          });
        }
      }
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.patch("/user/:id", (req, res) => {
  try {
    const id = req.params.id;
    const { username, email, phone } = req.body;
    const validateUserUpdateSchema = Joi.object({
      username: Joi.string().min(3).messages({
        "string.empty": `"username" cannot be empty`,
        "string.min": `"username" should have a minimum length of {#limit}`,
      }),

      email: Joi.string().messages({
        "string.empty": `"email" cannot be empty`,
      }),

      phone: Joi.string().messages({
        "string.empty": `"phone" cannot be empty`,
      }),
    }).or("username", "email", "phone");
    const { error, value } = validateUserUpdateSchema.validate(req.body);
    if (error) throw new Error(error.details[0].message);

    let keys = [];
    let values = Object.values(req.body);

    if (username) {
      keys.push("username = ?");
    }

    if (email) {
      keys.push("email = ?");
    }

    if (phone) {
      keys.push("phone = ?");
    }

    keys = keys.join();

    connection.query(
      {
        sql: `UPDATE USERS SET ${keys} WHERE user_id = ?`,
        values: [...values, id],
      },
      (error, result) => {
        try {
          if (error) throw new Error(error);
          if (result.affectedRows == 0) throw new Error("No such user_id!");
          else {
            res.status(200).json({
              status: true,
              message: "user details updated successfully",
              data: result,
            });
          }
        } catch (error) {
          res.status(500).json({
            status: false,
            message: error.message,
          });
        }
      }
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.delete("/user/:id", (req, res) => {
  try {
    const id = req.params.id;

    connection.query(
      {
        sql: "SELECT * FROM USERS WHERE user_id = ?",
        values: [id],
      },
      (error, result1) => {
        try {
          if (error) throw new Error(error);
          if (result1.length === 0) throw new Error("No such ID!");
          console.log("result:", result1[0]);
          connection.query(
            {
              sql: "DELETE FROM USERS WHERE user_id = ? ",
              values: [id],
            },
            (error, result) => {
              if (error) throw new Error(error);
              res.status(200).json({
                status: true,
                message: "User account deleted successfully!",
                data: result1[0],
              });
            }
          );
        } catch (error) {
          res.status(500).json({
            status: false,
            message: error.message,
          });
        }
      }
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.post("/articles/:user_id/:categ_id", (req, res) => {
  const { title, description, body } = req.body;
  const { user_id, categ_id } = req.params;

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
    });
    const { error, value } = validateArticleSchema.validate(req.body);
    if (error) throw new Error(error.details[0].message);

    connection.query(
      {
        sql: "SELECT * FROM USERS WHERE user_id =?",
        values: [user_id],
      },
      (error, result1) => {
        try {
          if (result1.length == 0) throw new Error("no such user_id");
          if (error) console.log(error);
          else {
            connection.query(
              {
                sql: "SELECT * FROM CATEGORIES WHERE categ_id =?",
                values: [categ_id],
              },
              (error, result2) => {
                if (result2.length === 0) throw new error("no such categ_id");
                if (error) console.log(error);
                else {
                  connection.query(
                    {
                      sql: "INSERT into ARTICLES (article_id,title,description,body,username,name) VALUES(?,?,?,?,?,?)",
                      values: [
                        uuidv4(),
                        title,
                        description,
                        body,
                        result1[0].username,
                        result2[0].name,
                      ],
                    },
                    (error, result) => {
                      if (error) throw new Error(error);
                      else {
                        res.status(201).json({
                          success: true,
                          message: "article created successfully!",
                          data: result,
                        });
                      }
                    }
                  );
                }
              }
            );
          }
        } catch (error) {
          res.status(200).json({
            status: false,
            message: error.message,
          });
        }
      }
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/articles", (req, res) => {
  let { search, order } = req.query;
  try {
    const orderColumns = [
      "title",
      "description",
      "body",
      "username",
      "name",
      "created_at",
      "updated_at",
    ];

    let orderColumn = orderColumns.includes(order) ? order : "created_at";

    if (search) {
      connection.query(
        {
          sql: `SELECT * FROM ARTICLES WHERE title LIKE ? OR description LIKE ? OR body LIKE ? OR username LIKE ? OR name LIKE ? ORDER BY ${orderColumn}`,
          values: [
            `%${search}%`,
            `%${search}%`,
            `%${search}%`,
            `%${search}%`,
            `%${search}%`,
          ],
        },
        (error, result) => {
          try {
            if (result.length == 0) throw new Error("No match found!");
            if (error) throw new Error(error);
            return res.status(200).json({
              status: true,
              message: "Articles fetched successfully!",
              data: result,
            });
          } catch (error) {
            return res.status(500).json({
              status: false,
              message: error.message,
            });
          }
        }
      );
    } else {
      connection.query(
        {
          sql: `SELECT * FROM ARTICLES ORDER BY ${orderColumn}`,
        },
        (error, result) => {
          try {
            if (result.length === 0) throw new Error("No article found!");
            if (error) throw new Error(error);
            return res.status(200).json({
              status: true,
              message: "Articles fetched successfully!",
              data: result,
            });
          } catch (error) {
            return res.status(500).json({
              status: false,
              message: error.message,
            });
          }
        }
      );
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/article/:id", (req, res) => {
  try {
    const id = req.params.id;
    connection.query(
      {
        sql: "SELECT * FROM ARTICLES WHERE article_id = ?",
        values: [id],
      },
      (error, result) => {
        try {
          if (result.length == 0) {
            throw new Error("No such article_id");
          }
          if (error) throw new Error(error);
          delete result[0].article_id;
          res.status(200).json({
            success: true,
            message: `Article fetched successfully!`,
            data: result[0],
          });
        } catch (error) {
          return res.status(500).json({
            status: false,
            message: error.message,
          });
        }
      }
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.patch("/article/:id", (req, res) => {
  const id = req.params.id;
  const { title, description, body, username, name } = req.body;
  try {
    const validateArticleSchema = Joi.object({
      title: Joi.string().min(10).max(50).messages({
        "string.empty": `"title" cannot be empty!`,
        "string.min": `"title" requires a min length of {#limit}!`,
        "string.max": `"title" length cannot be more than {#limit}`,
      }),
      description: Joi.string().min(10).max(75).messages({
        "string.empty": `"description" cannot be empty!`,
        "string.min": `"description" requires a min length of {#limit}!`,
        "string.max": `"description" length cannot be more than {#limit}`,
      }),
      body: Joi.string().min(10).max(500).messages({
        "string.empty": `"body" cannot be empty!`,
        "string.min": `"body" requires a min length of {#limit}!`,
        "string.max": `"body" length cannot be more than {#limit}`,
      }),
      username: Joi.string().optional(),
      name: Joi.string().optional(),
    })
      .or("title", "description", "body", "username", "name")
      .messages({
        "object.missing": `"title", "description", "body", "username", or "name" must be provided!`,
      });
    const { error, value } = validateArticleSchema.validate(req.body);
    if (error) throw new Error(error.details[0].message);

    let keys = [];
    let values = Object.values(req.body);
    let isUsername = false;
    let isName = false;

    for (let key in req.body) {
      keys.push(`${key} = ?`);
    }
    keys = keys.join(", ");
    if (keys.includes("username")) isUsername = true;
    if(keys.includes(" name")) isName = true;

    if (isUsername || isName) {
      if(isUsername){
        connection.query({
          sql: `SELECT * FROM USERS WHERE username = ? `,
          values: [username]
        }, (error, result) => {
          try{
            if(error) throw new Error(error)
            if(result.length == 0) throw new Error('This user does not exist!')
            console.log("result:",result)
          }
catch(error){
  res.status(500).json({
    status: false, 
    message: error.message
  })
}
        });
      }
      
      if(isName){
        connection.query({
          sql: `SELECT * FROM CATEGORIES WHERE name = ? `,
          values: [name]
        }, (error, result1) => {
          try{
            if(error) throw new Error(error)
            if(result1.length == 0) throw new Error('This category does not exist!')
            console.log('result1:',result1)
          }
catch(error){
  res.status(500).json({
    status: false, 
    message: error.message
  })
}
        }) 
      }
      connection.query({
        sql:`UPDATE ARTICLES SET ${keys} WHERE article_id = ?`,
        values: [...values,id]
      },(error, result2) => {
try{
  if(error) throw new Error(error)
  if(result2.affectedRows == 0)throw new Error('This article_id does not exist!')
  res.status(200).json({
status: true,
message: `Article with ID: ${id} updated successfully!`,
data: result2
})
}
catch(error){
  res.status(500).json({
    status: false, 
    message: error.message
  })
}
      })
     
    }
    connection.query({
      sql:`UPDATE ARTICLES SET ${keys} WHERE article_id = ?`,
      values: [...values,id]
    },(error, result3) => {
try{
if(error) throw new Error(error)
if(result3.affectedRows == 0)throw new Error('This article_id does not exist!')
res.status(200).json({
status: true,
message: `Article with ID: ${id} updated successfully!`,
data: result3
})
}
catch(error){
res.status(500).json({
  status: false, 
  message: error.message
})
}
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.delete("/article/:id", (req, res) => {
  const id = req.params.id;
  try {
    connection.query(
      {
        sql: "SELECT * FROM ARTICLES WHERE article_id = ?",
        values: [id],
      },
      (error, result1) => {
        try {
          if (error) throw new Error(error);
          if (result1.length === 0) throw new Error("No such article_id!");
          connection.query(
            {
              sql: "DELETE FROM ARTICLES WHERE article_id = ? ",
              values: [id],
            },
            (error, result) => {
              if (error) throw new Error(error);
              delete result1[0].article_id;
              res.status(200).json({
                status: true,
                message: "Article deleted successfully!",
                data: result1[0],
              });
            }
          );
        } catch (error) {
          res.status(500).json({
            status: false,
            message: error.message,
          });
        }
      }
    );
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
    connection.query(
      {
        sql: "INSERT into CATEGORIES (categ_id, name, description) VALUES(?,?,?)",
        values: [uuidv4(), name, description],
      },
      (error, result) => {
        if (error) throw new Error(error);
        else {
          res.status(201).json({
            success: true,
            message: `New category named: ${name} successfully added!`,
            data: result,
          });
        }
      }
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/categories", (req, res) => {
  let order = req.query.order;
  try {
    const orderColumns = ["name", "description", "created_at", "updated_at"];
    let orderColumn = orderColumns.includes(order) ? order : "created_at";
    connection.query(
      {
        sql: `SELECT * FROM CATEGORIES ORDER BY ${orderColumn}`,
      },
      (error, result) => {
        try {
          if (result.length == 0) throw new Error("No category found!");
          if (error) throw new Error(error);
          res.status(200).json({
            status: true,
            message: "All categories fetched successfully!",
            data: result,
          });
        } catch (error) {
          res.status(500).json({
            status: false,
            message: error.message,
          });
        }
      }
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.patch("/category/:id", (req, res) => {
  const id = req.params.id;
  const { name, description } = req.body;
  try {
    const validateCategorySchema = Joi.object({
      name: Joi.string().min(5).max(25).messages({
        "string.empty": `"name" cannot be empty!`,
        "string.min": `"name" requires a min length of {#limit}!`,
        "string.max": `"name" length cannot be more than {#limit}`,
      }),
      description: Joi.string().min(10).max(75).messages({
        "string.empty": `"description" cannot be empty!`,
        "string.min": `"description" requires a min length of {#limit}!`,
        "string.max": `"description" length cannot be more than {#limit}`,
      }),
    })
      .or("name", "description")
      .messages({
        "object.missing": `"name" or "description" must be provided!`,
      });
    const { error, value } = validateCategorySchema.validate(req.body);
    if (error) throw new Error(error.details[0].message);

    let keys = [];
    let values = Object.values(req.body);
    if (name) keys.push(`name = ?`);
    if (description) keys.push(`description = ?`);
    keys = keys.join();

    connection.query(
      {
        sql: `UPDATE CATEGORIES SET ${keys} WHERE categ_id = ?`,
        values: [...values, id],
      },
      (error, result) => {
        try {
          if (error) throw new Error(error);
          if (result.affectedRows === 0) throw new Error("No such categ_id!");
          return res.status(200).json({
            status: true,
            message: `Category with ID: ${id} updated successfully!`,
            data: result,
          });
        } catch (error) {
          return res.status(500).json({
            status: false,
            message: error.message,
          });
        }
      }
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.delete("/category/:id", (req, res) => {
  const id = req.params.id;
  try {
    connection.query(
      {
        sql: "SELECT * FROM CATEGORIES WHERE categ_id = ?",
        values: [id],
      },
      (error, result1) => {
        try {
          if (error) throw new Error(error);
          if (result1.length === 0) throw new Error("No such categ_id!");
          connection.query(
            {
              sql: "DELETE FROM CATEGORIES WHERE categ_id = ? ",
              values: [id],
            },
            (error, result) => {
              if (error) throw new Error(error);
              delete result1[0].categ_id;
              return res.status(200).json({
                status: true,
                message: `${result1[0].name} category deleted successfully!`,
                data: result1[0],
              });
            }
          );
        } catch (error) {
          return res.status(500).json({
            status: false,
            message: error.message,
          });
        }
      }
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
