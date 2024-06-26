
import { FC, useState } from "react";
import { Form, json } from "@remix-run/react";
import { ActionFunction } from "@remix-run/node";

type Status = "todo" | "doing" | "done";

interface Tasks {
  id: number;
  des: string;
  status: Status;
}

interface BaseTaskProp {
  handleRemove: (id: number) => void;
  onChange: (id: number, status: Status) => void;
}

interface TaskListProps extends BaseTaskProp {
  tasks: Tasks[];
  status: Status;
}

let id = 0;
const makeId = () => ++id;

const TaskList: FC<TaskListProps> = ({ status, tasks, handleRemove, onChange }) => {
  return (
    <ul>
      {tasks.filter(task => task.status === status).map(task => (
        <li key={task.id}>
          <h3>{task.des}</h3>
          <button onClick={() => onChange(task.id, "todo")}>todo</button>
          <button onClick={() => onChange(task.id, "doing")}>doing</button>
          <button onClick={() => onChange(task.id, "done")}>done</button>
          <button onClick={() => handleRemove(task.id)}>remove</button>
        </li>
      ))}
    </ul>
  );
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const actionType = formData.get("actionType");
  const des = formData.get("des") as string;
  const tasksJson = formData.get("tasks") as string;

  let tasks: Tasks[] = tasksJson ? JSON.parse(tasksJson) : [];

  if (actionType === "add") {
    if (!des) return alert("You must write something!");
    tasks.push({ id: makeId(), des, status: "todo" });
  }
  return json({ tasks });
};

const Todo: FC = () => {
  const [tasks, setTasks] = useState<Tasks[]>([
    { id: makeId(), des: "first", status: "todo" },
    { id: makeId(), des: "second", status: "doing" },
    { id: makeId(), des: "third", status: "done" }
  ]);
  const [taskInp, setTaskInp] = useState("");

  const handleRemove = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const onChange = (id: number, status: Status) => {
    setTasks(tasks.map(task => {
      if (task.id !== id) return task;
      return { ...task, status };
    }));
  };

  return (
    <div>
      <Form method="post">
        <input value={taskInp} onChange={(e) => setTaskInp(e.target.value)} name="des" />
        <input value="add" type="submit" name="actionType" />
        <input type="hidden" name="tasks" value={JSON.stringify(tasks)} />
      </Form>
      <ul>
        {(["todo", "doing", "done"] as Status[]).map(status => (
          <li key={status}>
            <h1>{status}</h1>
            <TaskList
              status={status}
              tasks={tasks}
              handleRemove={handleRemove}
              onChange={onChange}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todo;

