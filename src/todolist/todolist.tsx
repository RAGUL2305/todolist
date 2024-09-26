import React, { ChangeEvent, useEffect, useState } from "react";
import "./todo.css";
import _ from "lodash";

type View = 'all' | 'active' | 'complete';

interface Task {
  todo: string;
  completed: boolean;
}

function Todo() {
  const [newTask, setNewTask] = useState<Task[]>([]);
  const [value, setValue] = useState<string>("");
  const [view, setView] = useState<View>("all");
  const [array, setArray] = useState<Task[]>([]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleCheckboxChange = (item: Task) => {
    setNewTask((prevTasks) =>
      _.map(prevTasks,(task) =>
        task.todo === item.todo ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleRemoveClick = (item: Task) => {
    setNewTask((prevTasks) =>_.filter( prevTasks,(task) => task.todo !== item.todo));
  };

  const handleRemoveCheckedClick = () => {
    setNewTask((prevTasks) => _.filter(prevTasks,(task) => !task.completed));
  };

  const handleOptionClick = (option: View) => {
    setView(option);
  };

  useEffect(() => {
    handleArray();
  }, [view, newTask]);

  const handleArray = () => {
    switch (view) {
      case "all":
        setArray(newTask);
        break;
      case "active":
        setArray(_.filter(newTask,(task) => !task.completed));
        break;
      case "complete":
        setArray(_.filter(newTask,(task) => task.completed));
        break;
      default:
        setArray(newTask);
    }
  };

  const handleKeyDown = (key: string) => {
    if (key === "Enter" && value.trim() !== "" && !newTask.some((task) => task.todo === value)) {
      setNewTask([...newTask, { todo: value, completed: false }]);
      setValue("");
    }
  };

  return (
    <div>
      <div className="initialbackground">
        <h1 className="head">todos</h1>
        <div>
          <input
            type="text"
            value={value}
            className="inputbox"
            placeholder="What needs to be done?"
            onChange={handleInputChange}
            onKeyDown={(e) => handleKeyDown(e.key)}
          />
        </div>

        <ul>
          {array.map((item, index) => (
            <li className="list-container" key={index}>
              <span>
                <input
                  type="checkbox"
                  className="checkbox-round"
                  onChange={() => handleCheckboxChange(item)}
                  checked={item.completed}
                />
                <span className={`list-name ${item.completed ? "completed" : ""}`}>
                  {item.todo}
                </span>
              </span>

              <button className="clearbutton" onClick={() => handleRemoveClick(item)}>
                X
              </button>
            </li>
          ))}
        </ul>
        removeTodo
        <span>
          {newTask.length > 0 && (
            <div className="tbl">
              {newTask.filter((task) => !task.completed).length} item(s) left!
              <button onClick={() => handleOptionClick("all")}>All</button>
              <button onClick={() => handleOptionClick("active")}>Active</button>
              <button onClick={() => handleOptionClick("complete")}>Completed</button>
              <button onClick={handleRemoveCheckedClick}>Clear completed</button>
            </div>
          )}
        </span>
      </div>
    </div>
  );
}

export default Todo;
	
