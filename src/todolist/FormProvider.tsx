import React, {
  useContext,
  createContext,
  useReducer,
  ChangeEvent,
  PropsWithChildren,
} from "react";
import "./todo.css";
import _ from "lodash";
import produce from "immer";

type View = "all" | "active" | "complete";

interface Task {
  todo: string;
  completed: boolean;
}

interface State {
  todos: Task[];
  newTodo: string;
  view: View;
  filteredTodos: Task[];
}

export interface ContextType {
  todos: Task[];
  newTodo: string;
  view: View;
  filteredTodos: Task[];
  setNewTodo: (e: ChangeEvent<HTMLInputElement>) => void;
  setCompleted: (item: string) => void;
  removeTodo: (item: string) => void;
  deleteCompletedTodos: () => void;
  setView: (option: View) => void;
  addNewTodo: (key: string) => void;
}

type Action =
  | { type: "ADD_NEW_TODO"; payload: string }
  | { type: "CHECKED_ITEMS"; payload: string }
  | { type: "ITEM_REMOVE"; payload: string }
  | { type: "CHECKED_ITEMS_REMOVE" }
  | { type: "SET_VIEW"; payload: View }
  | { type: "CHANGE_OPTIONS"; payload: string }
  | { type: "SHOW_TODO_LIST"; payload: string };

const initialState: State = {
  todos: [],
  newTodo: "",
  view: "all",
  filteredTodos: [],
};

const reducer = produce((state: State, action: Action) => {
  switch (action.type) {
    case "ADD_NEW_TODO":
      state.newTodo = action.payload;
      break;
    case "CHECKED_ITEMS":
      state.todos = state.todos.map((task) =>
        task.todo === action.payload
          ? { ...task, completed: !task.completed }
          : task
      );
      break;
    case "ITEM_REMOVE":
      state.todos = state.todos.filter(
        (option: Task) => option.todo !== action.payload
      );
      break;
    case "CHECKED_ITEMS_REMOVE":
      state.todos = state.todos.filter((option: Task) => !option.completed);
      break;

    case "SET_VIEW":
      state.view = action.payload;
      break;

    case "CHANGE_OPTIONS":
      switch (state.view) {
        case "all":
          state.filteredTodos = state.todos;
          break;
        case "active":
          state.filteredTodos = state.todos.filter(
            (option: Task) => !option.completed
          );
          break;
        case "complete":
          state.filteredTodos = state.todos.filter((task) => task.completed);
          break;
        default:
          state.filteredTodos = state.todos;
      }
      break;
    case "SHOW_TODO_LIST":
      if (action.payload === "Enter" && state.newTodo.trim() !== "") {
        {
          state.todos.push({ todo: state.newTodo, completed: false });
          state.newTodo = "";
        }
      } else {
        return alert("Please add a ToDo then click enter");
      }

      state.filteredTodos = state.todos;
      break;
  }
});

const FormContext = createContext<ContextType | undefined>(undefined);

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("The components should be enclosed within provider");
  }
  return context;
};

function FormProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setNewTodo = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "ADD_NEW_TODO",
      payload: e.target.value,
    });
  };

  const setCompleted = (item: string) => {
    dispatch({ type: "CHECKED_ITEMS", payload: item });
    dispatch({
      type: "CHANGE_OPTIONS",
      payload: state.view,
    });
  };

  const removeTodo = (item: string) => {
    dispatch({
      type: "ITEM_REMOVE",
      payload: item,
    });
    dispatch({
      type: "CHANGE_OPTIONS",
      payload: state.view,
    });
  };
  const deleteCompletedTodos = () => {
    dispatch({
      type: "CHECKED_ITEMS_REMOVE",
    });
  };

  const setView = (option: View) => {
    dispatch({
      type: "SET_VIEW",
      payload: option,
    });
    dispatch({
      type: "CHANGE_OPTIONS",
      payload: state.view,
    });
  };

  const addNewTodo = (key: string): void => {
    if (key === "Enter") {
      dispatch({
        type: "SHOW_TODO_LIST",
        payload: key,
      });
    }
  };

  return (
    <FormContext.Provider
      value={{
        todos: state.todos,
        newTodo: state.newTodo,
        view: state.view,
        filteredTodos: state.filteredTodos,
        setNewTodo,
        setCompleted,
        removeTodo,
        deleteCompletedTodos,
        setView,
        addNewTodo,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

export default FormProvider;
