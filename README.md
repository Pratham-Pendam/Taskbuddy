# Taskbuddy
TaskBuddy is your personal productivity sidekick — meticulously built to make task management simple, smart, and even enjoyable. We understand the challenges of modern life, and that's why we've designed an intuitive platform that adapts to your unique needs.
## 📸 Screenshot

![Taskbuddy ](assets/Taskbuddy.png)



---

## 📦 Setup Instructions

### STEP 01 - Clone the Project

```bash
git clone https://github.com/yourusername/ai-task-manager.git
```



### ✅ STEP 02- Install Dependencies

```bash
npm install
```

### ✅ STEP 03 - Create .env Files

```bash
DATABASE_URL="your_neon_postgres_url"
GEMINI_API_KEY="your_gemini_key"
```



✅ STEP 04 - Run with Docker Compose

```bash
docker-compose up --build

```

## 🛠️ Tech Stack

```bash
- React + TanStack Router + TanStack Query 
- Hono (Backend) with oRPC
- PostgreSQL via Drizzle ORM
- Gemini AI API
- Hosted on Vercel & Render
```
## 📡 2. API Documentation

### 📌 Create Task

```bash
| Feature          | Detail                                                              |
| ---------------- | ------------------------------------------------------------------- |
| **Endpoint**     | `/tasks/create`                                                     |
| **Method**       | `POST`                                                              |
| **Description**  | Creates a new task                                                  |
| **Request Body** | `{ "title": "string", "description": "string", "priority": "low" }` |
| **Response**     | Returns the created task as JSON or an error                        |

````

### 📋 Get All Tasks

```bash
| Feature         | Detail                      |
| --------------- | --------------------------- |
| **Endpoint**    | `/tasks`                    |
| **Method**      | `GET`                       |
| **Description** | Returns a list of all tasks |
| **Response**    | `{ tasks: [...] }`          |

````

### 🤖 AI Task Creation

```bash
| Feature          | Detail                                              |
| ---------------- | --------------------------------------------------- |
| **Endpoint**     | `/tasks/ai-create`                                  |
| **Method**       | `POST`                                              |
| **Description**  | Creates a task using AI from natural language input |
| **Request Body** | `{ "input": "Buy groceries and clean room" }`       |
| **Response**     | AI-generated task object or error                   |


````



### ✏️ Get Task by ID (for Editing)

```bash
| Feature         | Detail                            |
| --------------- | --------------------------------- |
| **Endpoint**    | `/tasks/edit/:id`                 |
| **Method**      | `GET`                             |
| **Description** | Retrieves a single task by its ID |
| **Response**    | JSON object of the task or error  |

````

### 🛠️ Update Task

```bash
| Feature          | Detail                                                              |
| ---------------- | ------------------------------------------------------------------- |
| **Endpoint**     | `/tasks/edit/:id`                                                   |
| **Method**       | `PUT`                                                               |
| **Description**  | Updates a task by ID                                                |
| **Request Body** | `{ "title": "string", "description": "string", "priority": "mid" }` |
| **Response**     | Updated task JSON or error                                          |

````

### 🗑️ Delete Task

```bash
| Feature         | Detail                            |
| --------------- | --------------------------------- |
| **Endpoint**    | `/tasks/:id`                      |
| **Method**      | `DELETE`                          |
| **Description** | Deletes a task by ID              |
| **Response**    | `{ message: "Deleted" }` or error |

````

### ✅ Mark Task as Completedk

```bash
| Feature          | Detail                     |
| ---------------- | -------------------------- |
| **Endpoint**     | `/tasks/complete/:id`      |
| **Method**       | `PATCH`                    |
| **Description**  | Marks a task as completed  |
| **Request Body** | `{ "completed": true }`    |
| **Response**     | Updated task JSON or error |


````
