import React, { useEffect, useState } from "react";
import Task from "./task";


const Home = () => {
	const user = "martafagundez";
	const [newTodo, setNewTodo] = useState({label: "", done: false});
	const [todos, setTodos] = useState([]);

	useEffect(() => {
		resetTodoListOnServer();

	}, []);

	
	function resetTodoListOnServer() {
		try {
			// Eliminar la lista de tareas del usuario (si existiera)
			fetch(`https://playground.4geeks.com/apis/fake/todos/user/${user}`, {
				method: "DELETE"
			})
			// Crear la lista de tareas del usuario
			.then(() => 
				fetch(`https://playground.4geeks.com/apis/fake/todos/user/${user}`, {
					method: "POST",
					body: JSON.stringify([]),
					headers: {
						"Content-Type": "application/json"
					}
				})
			)
			// Obtener la lista de todos del servidor
			.then(() => {
				return fetch(`https://playground.4geeks.com/apis/fake/todos/user/${user}`)
			})
			.then(response => response.json())
			.then(data => {
				setTodos(() => {
					return data.map(todo => {
						return {label: todo.label, done: todo.done};
					})
				})
			})
			.catch(error => {
				console.log(error);
				throw error;
			});
		} catch (error) {
			alert("Error al reiniciar la lista de tareas en el servidor.");
		}
	}
	 

	function addTodoOnServer(aditionalTodo) {
		console.log("TODOS jsonStringigy:");
		console.log(JSON.stringify([...todos, aditionalTodo]));
		try {
			fetch(`https://playground.4geeks.com/apis/fake/todos/user/${user}`, {
				method: "PUT",
				body: JSON.stringify([...todos, aditionalTodo]),
				headers: {
					"Content-Type": "application/json"
				}
			})
			.then((response) => response.json())
			.then(data => console.log("Confirmación del put", data.msg))
			.then(() => getTodoListFromServer())
			.catch(error => {
				console.log(error);
				throw error;
			});
		} catch (error) {
			alert("Error al actualizar la lista de tareas en el servidor.");
		}
	}

	function removeTodoOnServer(deletedTodoId) {
		try {
			fetch(`https://playground.4geeks.com/apis/fake/todos/user/${user}`, {
				method: "PUT",
				body: JSON.stringify(todos.filter((todo, index) => index !== deletedTodoId)),
				headers: {
					"Content-Type": "application/json"
				}
			})
			.then((response) => response.json())
			.then(data => console.log("Confirmación del put", data.msg))
			.then(() => getTodoListFromServer())
			.catch(error => {
				console.log(error);
				throw error;
			});
		} catch (error) {
			alert("Error al actualizar la lista de tareas en el servidor.");
		}
	}

	function completeTodoOnServer(completedTodoId) {
		const newArray = todos.map((todo, index) => {
			if (index === completedTodoId) {
				return {...todo, done: !todo.done}
			}
			return todo;
		});

		try {
			fetch(`https://playground.4geeks.com/apis/fake/todos/user/${user}`, {
				method: "PUT",
				body: JSON.stringify(newArray),
				headers: {
					"Content-Type": "application/json"
				}
			})
			.then((response) => response.json())
			.then(data => console.log("Confirmación del put", data.msg))
			.then(() => getTodoListFromServer())
			.catch(error => {
				console.log(error);
				throw error;
			});
		} catch (error) {
			alert("Error al actualizar la lista de tareas en el servidor.");
		}
	}

	function getTodoListFromServer() {
		try {
			fetch(`https://playground.4geeks.com/apis/fake/todos/user/${user}`)
			.then(response => response.json())
			.then(data => {
				setTodos(() => {
					return data.map(todo => {
						return {label: todo.label, done: todo.done};
					})
				})
			})
			.catch(error => {
				console.log(error);
				throw error;
			});
		} catch (error) {
			alert("Error al reiniciar la lista de tareas en el servidor.");
		}
	}


	function addTodo(e) {
		if (e.key === "Enter") {
			addTodoOnServer(newTodo);
			setNewTodo({label: "", done: false});
		}
	}

	function deleteTodo(i) {
		removeTodoOnServer(i);
	}

	function completeTodo(i) {
		completeTodoOnServer(i);
	}


	return (
		<div className="d-flex flex-column justify-content-center align-items-center min-vh-100" style={{backgroundColor: "#f5f5f5", paddingTop: "3vh"}} >
			<h1 className="colorPurple display-1 fw-light mb-4">todos</h1>
			
			<div className="d-flex flex-column w-100 shadow" style={{maxWidth: "400px"}}>
				<input
					type="text"
					className="text-muted fw-light fs-4 py-2 px-4 d-block w-100"
					style={{"--bs-text-opacity": 0.25}}
					placeholder="Enter your todo"
					autoComplete="off"
					value={newTodo.label}
					onChange={e => setNewTodo({label: e.target.value, done: false})}
					onKeyDown={addTodo}
				/>

				<ul className="bg-white m-0 list-unstyled">
					{todos.map((todo, index) => {
						return (
							<Task key={index} id={index} task={todo.label} state={todo.done} deleteHandler={deleteTodo} completeHandler={completeTodo}></Task>
						)
					})}
				</ul>

				<div className="d-flex justify-content-between align-items-center py-2 px-3">
					<p className="text-black-50 fw-light fs-6 m-0">
						{
							todos.length > 1 ? `${todos.length} items left` 
							: todos.length === 1 ? "1 item left" 
							: "No tasks, add a task"
						}
					</p>

					<button type="button" className="btn btn-outline-danger fs-6"
					onClick={resetTodoListOnServer}>Delete All</button>
				</div>
			</div>

			<div className="m-4 text-center colorGray fw-light fs-6" style={{opacity: 0.5}}>
				<p className="mb-0">Click on the task to toggle completed.</p>
				<p>Click on the x to delete the task.</p>
			</div>
		</div>
	);
};

export default Home;
