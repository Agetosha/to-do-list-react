import { useState, useEffect } from "react";
import { Check, Trash, RefreshCw, Moon, Sun } from "lucide-react"; //иконки

export default function TodoList() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [completedTasks, setCompletedTasks] = useState(() => {
    const savedCompletedTasks = localStorage.getItem("completedTasks");
    return savedCompletedTasks ? JSON.parse(savedCompletedTasks) : [];
  });

  const [task, setTask] = useState("");
  const [showCompleted, setShowCompleted] = useState(() => {
    const savedShowCompleted = localStorage.getItem("showCompleted");
    return savedShowCompleted ? JSON.parse(savedShowCompleted) : false;
  });

  const [theme, setTheme] = useState(() => {
    return document.documentElement.getAttribute("data-theme") || "light";
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
  }, [completedTasks]);

  useEffect(() => {
    localStorage.setItem("showCompleted", JSON.stringify(showCompleted));
  }, [showCompleted]);

  // Функция переключения темы
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, { text: task, completed: false }]);
      setTask("");
    }
  };

  const completeTask = (index) => {
    const taskToComplete = tasks[index];
    setCompletedTasks([...completedTasks, taskToComplete]);
    setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
  };

  const restoreTask = (index) => {
    const taskToRestore = completedTasks[index];
    setTasks([...tasks, taskToRestore]);
    setCompletedTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
  };

  const removeTask = (index) => {
    setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
  };

  const removeCompletedTask = (index) => {
    setCompletedTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
  };

  return (
    <>
      <button
        onClick={toggleTheme}
        className="theme-toggle"
        title={
          theme === "light"
            ? "Переключить на темную тему"
            : "Переключить на светлую тему"
        }
      >
        {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
      </button>
      <div className="todo-container">
        <h1 className="todo-title">To-Do List</h1>
        <div className="todo-form">
          <input
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Добавить новую задачу"
            className="todo-input"
            onKeyPress={(e) => e.key === "Enter" && addTask()}
          />
          <button onClick={addTask} className="todo-button">
            Добавить
          </button>
        </div>

        <div>
          <h2 className="todo-section-title">Активные задачи</h2>
          <ul className="todo-list">
            {tasks.map((t, index) => (
              <li key={index} className="todo-item">
                <span className="todo-item-text">{t.text}</span>
                <div className="todo-actions">
                  <button
                    onClick={() => completeTask(index)}
                    className="action-button action-complete"
                  >
                    <Check />
                  </button>
                  <button
                    onClick={() => removeTask(index)}
                    className="action-button action-delete"
                  >
                    <Trash />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {tasks.length === 0 && (
            <p className="empty-message">Нет активных задач</p>
          )}
        </div>

        <div>
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="toggle-completed"
          >
            {showCompleted
              ? "Скрыть завершенные задачи"
              : "Показать завершенные задачи"}
            <span className="completed-count">{completedTasks.length}</span>
          </button>

          {showCompleted && (
            <div>
              <h2 className="todo-section-title">Завершенные задачи</h2>
              <ul className="todo-list">
                {completedTasks.map((t, index) => (
                  <li key={index} className="todo-item todo-item-completed">
                    <span className="todo-item-text">{t.text}</span>
                    <div className="todo-actions">
                      <button
                        onClick={() => restoreTask(index)}
                        className="action-button action-restore"
                      >
                        <RefreshCw size={18} />
                      </button>
                      <button
                        onClick={() => removeCompletedTask(index)}
                        className="action-button action-delete"
                      >
                        <Trash />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              {completedTasks.length === 0 && (
                <p className="empty-message">Архив пуст</p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
