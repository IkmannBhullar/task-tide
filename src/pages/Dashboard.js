import React, { useState, useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { lightTheme, darkTheme } from "../styles/theme";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load tasks from local storage when the component mounts
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);
  }, []);

  // Save tasks to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (newTask.trim() === "") return;
    setTasks([...tasks, { id: Date.now(), title: newTask, status: "To Do" }]);
    setNewTask("");
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <DndProvider backend={HTML5Backend}>
        <DashboardWrapper>
          <Header>
            <h1>Welcome to Your Dashboard</h1>
            <ToggleButton onClick={() => setIsDarkMode(!isDarkMode)}>
              Toggle {isDarkMode ? "Light" : "Dark"} Mode
            </ToggleButton>
          </Header>

          <TaskForm>
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter a new task"
            />
            <button onClick={handleAddTask}>Add Task</button>
          </TaskForm>

          <TaskColumns>
            <TaskColumn tasks={tasks} setTasks={setTasks} status="To Do" />
            <TaskColumn tasks={tasks} setTasks={setTasks} status="In Progress" />
            <TaskColumn tasks={tasks} setTasks={setTasks} status="Completed" />
          </TaskColumns>
        </DashboardWrapper>
      </DndProvider>
    </ThemeProvider>
  );
};

const TaskColumn = ({ tasks, setTasks, status }) => {
  const [, drop] = useDrop({
    accept: "task",
    drop: (item) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === item.id ? { ...task, status } : task
        )
      );
    },
  });

  const handleDeleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  return (
    <ColumnWrapper ref={drop}>
      <h2>{status}</h2>
      {tasks
        .filter((task) => task.status === status)
        .map((task) => (
          <TaskCard key={task.id} task={task} onDelete={handleDeleteTask} />
        ))}
    </ColumnWrapper>
  );
};

const TaskCard = ({ task, onDelete }) => {
  const [, drag] = useDrag({
    type: "task",
    item: { id: task.id },
  });

  return (
    <Card ref={drag}>
      <span>{task.title}</span>
      <DeleteButton onClick={() => onDelete(task.id)}>Delete</DeleteButton>
    </Card>
  );
};

export default Dashboard;

// Styled Components
const DashboardWrapper = styled.div`
  padding: 20px;
  background-color: ${(props) => props.theme.colors.background};
  min-height: 100vh;
  color: ${(props) => props.theme.colors.text};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h1 {
    margin: 0;
  }
`;

const ToggleButton = styled.button`
  padding: 10px 15px;
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.white};
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const TaskForm = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;

  input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  button {
    padding: 10px 15px;
    background-color: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.white};
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
`;

const TaskColumns = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
`;

const ColumnWrapper = styled.div`
  flex: 1;
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: 10px;
  padding: 10px;
  box-shadow: ${(props) => props.theme.shadows.medium};

  h2 {
    text-align: center;
  }
`;

const Card = styled.div`
  background-color: ${(props) => props.theme.colors.white};
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  box-shadow: ${(props) => props.theme.shadows.light};
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: move;
`;

const DeleteButton = styled.button`
  background-color: ${(props) => props.theme.colors.danger};
  color: ${(props) => props.theme.colors.white};
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
`;