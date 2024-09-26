import React from "react";
import { useFormContext } from "./FormProvider";
import "./todo.css";
import _ from "lodash";


function ToDO(){
  const{
    todos,
    newTodo,
    filteredTodos,
    setCompleted,
    setNewTodo,
    deleteCompletedTodos,
    removeTodo,
    setView,
    addNewTodo}= useFormContext();

    return(
        <div>
      <div className="initialbackground">
        <h1 className="head">todos</h1>
        <div>
          <input
            type="text"
           value={newTodo}
            className="inputbox"
            placeholder="What needs to be done?"
            onChange={setNewTodo}
            onKeyDown={(e) => addNewTodo(e.key)}
          />
        </div>

        <ul>
          {filteredTodos.map((item, index:number) => (
            <li className="list-container" key={index}>
              <span>
                <input
                  type="checkbox"
                  className="checkbox-round"
                  onChange={() => setCompleted(item.todo)}
                  checked={item.completed}
                />
                <span className="list-name">{item.todo}</span>
              </span>

              <button
                className="clearbutton"
                onClick={() => removeTodo(item.todo)}
              >
                X
              </button>
            </li>
          ))}
        </ul>

        <span>
          {todos.length > 0 && (
            <div className="tbl">
              {todos.filter((task) => !task.completed).length} item left!
              <button onClick={() => setView("all")}>All</button>
              <button onClick={() => setView("active")}>
                Active
              </button>
              <button onClick={() => setView("complete")}>
                Completed
              </button>
              <button onClick={deleteCompletedTodos}>Clear completed</button>
            </div>
          )}
        </span>
      </div>
    </div>
    )
}
export default ToDO;