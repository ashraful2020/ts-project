import React, { useCallback, useReducer, useRef, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css"; 
import { Container, Form } from "react-bootstrap";
import { Grid } from "@mui/material";

function App() {
// todo card backgound color
    const [color, setColor] = useState("#b3a7c6");
  
    interface Todo {
    id: number;
    text: string;
    subject: string;
  }

  // Action Type check in typescript
  type ActionType =
    | { type: "ADD"; text: string; subject: string }
    | { type: "REMOVE"; id: number };


    // useReducer hook 
  function reducer(state: Todo[], action: ActionType) {
    switch (action.type) {
      // Add a todo 
      case "ADD":
        //Add todo in local storage 
        const a: Todo[] = [
          ...state,
          { id: state.length + 1, text: action.text, subject: action.subject },
        ];
        localStorage.setItem("todo", JSON.stringify(a));
        return [
          ...state,
          {
            id: state.length + 1,
            text: action.text,
            subject: action.subject,
          },
        ];
        // Remove todo
        case "REMOVE":
          const arrayItem = state.filter((todo) => todo.id !== action.id);
          // Remove todo from localStorage
        localStorage.setItem("todo", JSON.stringify(arrayItem));

        return state.filter((todo) => todo.id !== action.id);
    }
  }
  // initiale Value
  const newTodos: Todo[] = JSON.parse(localStorage.getItem("todo") || "[]");

  //reducer
  const [todos, dispatch] = useReducer(reducer, newTodos);

  // input box value...
  const newTodoRef = useRef<HTMLInputElement>(null);
  const newTodoRef1 = useRef<HTMLInputElement>(null);

  //Add to todo list
  const handleAddTodo = useCallback((e) => {
    if (newTodoRef.current && newTodoRef1.current) {
      dispatch({
        type: "ADD",
        text: newTodoRef.current?.value,
        subject: newTodoRef1.current.value,
      });
      newTodoRef.current.value = "";
      newTodoRef1.current.value = "";
    }
    e.preventDefault();
  }, []);

  // Remove from todo list
  const handleRemoveTodo = useCallback((e) => {
    if (newTodoRef.current) {
      dispatch({ type: "REMOVE", id: e });
    }
  }, []);



// set Background color
  const backgroundColorStyle = {
    backgroundColor: color,
  };

  return (
    <div className="App">
      <h1 style={{ color: "goldenrod" }}>Todo Application </h1>

      {/*  Take todo information  */}
      <form onSubmit={handleAddTodo}>
        <input
          className="inputForm"
          ref={newTodoRef1}
          required
          placeholder="Subject"
        />
        <input
          className="inputForm"
          ref={newTodoRef}
          required
          placeholder="Notes"
        />
        <input className="inputForm" type="submit" />
      </form>
{/*  Show the todo list */}

      <div>
        <Container className="todo-container">
          <Grid container spacing={4}>
            {todos.map((todo) => (
              <Grid item xs={12} sm={6} md={4} sx={{}} key={todo?.id}>
                <div className="note-card" style={backgroundColorStyle}>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveTodo(todo?.id)}
                  >
                    X
                  </button>

                  {/* Dynamic color picker  */}
                  <Form.Control
                    className="color"
                    size="sm"
                    type="color"
                    id="exampleColorInput"
                    defaultValue="#563d7c"
                    title="Choose your color"
                    onChange={(e) => setColor(e.target.value)}
                  />

                  {/*   Todo informtaion */}
                  <big>
                    Subject:
                    <b>{todo?.subject}</b>
                  </big>
                  <p> {todo?.text}</p>
                </div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </div>
    </div>
  );
}
export default App;
