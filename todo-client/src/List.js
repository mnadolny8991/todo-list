import { useState, useEffect } from 'react';
import Task from './Task';
import TaskForm from './TaskForm';

const statuses = ['Planned', 'In Progress', 'Complete'];

function List() {
    const [status, setStatus] = useState('planned');
    const [tasks, setTasks] = useState([]);
    const [inputTask, setInputTask] = useState({ status: 'planned' });
    const [added, setAdded] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const resp = await fetch('http://localhost:9000/tasks', {
                headers: {
                    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjAsImxvZ2luIjoidXNlcjEyM2EiLCJpYXQiOjE3MTAxNjA1NzZ9.34gsrMlh4oJ-o1SbolIOCMm7FYPDGfFO-XXIja2dFz8"
                }
            });
            let data = await resp.json();
            data.forEach(d => {
                d.due = new Date(d.due);
            });
            setTasks(data);
        }

        fetchData();
        setAdded(false);
    }, [status, added]);

    function statusEntryClassNames(entry) {
        return 'status__entry ' + 
            ((status === entry.toLowerCase()) ? 'status__entry--selected' : '');
    }

    function handleStatusEntryClick(e) {
        setStatus(String(e.target.innerHTML).toLowerCase());
        console.log(String(e.target.innerHTML).toLowerCase());
        // setStatus('in progress');
    }

    async function updateStatusDb(taskId, newStatus) {
        if (newStatus === 'in progress') newStatus = 'in_progress';
        try {
            await fetch(`http://localhost:9000/tasks/${ taskId }/${ newStatus }`, { 
                method: 'PATCH',
                headers: {
                    "Authorization": 
                        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjAsImxvZ2luIjoidXNlcjEyM2EiLCJpYXQiOjE3MTAxNjA1NzZ9.34gsrMlh4oJ-o1SbolIOCMm7FYPDGfFO-XXIja2dFz8"
                }
            });
        } catch (e) {
            console.log(e);
        }
    }

    async function handleRightClick(e, id) {
        let newStatus = 'planned';  
        setTasks(tasks.map(t => {
            if (t.id === id) {
                if (t.status === 'planned') newStatus = 'in progress';
                else if (t.status === 'in progress') newStatus = 'complete';
                return { ...t, status: newStatus };
            }
            return t;
        }));
        await updateStatusDb(id, newStatus);
        console.log('I am reaching this point');
        setStatus(newStatus);
    }

    async function handleLeftClick(e, id) {
        let newStatus = 'complete';
        setTasks(tasks.map(t => {
            if (t.id === id) {
                if (t.status === 'complete') newStatus = 'in progress';
                else if (t.status === 'in progress') newStatus = 'planned';    
                return { ...t, status: newStatus };
            }
            return t;
        }));
        await updateStatusDb(id, newStatus);
        setStatus(newStatus);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const newTask = { ...inputTask, due: inputTask.due.toISOString() };
        await fetch('http://localhost:9000/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjAsImxvZ2luIjoidXNlcjEyM2EiLCJpYXQiOjE3MTAxNjA1NzZ9.34gsrMlh4oJ-o1SbolIOCMm7FYPDGfFO-XXIja2dFz8',  
                },
                body: JSON.stringify(newTask)
            });
        setAdded(true);
        setStatus('planned');
    }

    function handleDateChange(e) {
        const val = String(e.target.value);
        const date = val.split('-');
        let newDate = new Date(inputTask.due);
        newDate.setFullYear(date[0]);
        newDate.setMonth(date[1] - 1);
        newDate.setDate(date[2]);
        setInputTask({ ...inputTask, due: newDate })
    }

    function handleTimeChange(e) {
        const val = String(e.target.value);
        const time = val.split(':');
        let newDate = new Date(inputTask.due);
        newDate.setHours(time[0], time[1]);
        setInputTask({ ...inputTask, due: newDate });
    }

    function handleDescChange(e) {
        const val = String(e.target.value);
        setInputTask({ ...inputTask, description: val })
    }

    return (
        <main>
            <ul className='status container'>
                { statuses.map((s, i) => 
                    <li 
                        className={statusEntryClassNames(s)} 
                        key={i}
                        onClick={e => handleStatusEntryClick(e)}>
                        {s}
                    </li>)
                }
            </ul>
            <section className='tasks container'>
                { tasks.map(t => 
                    (t.status === status) && <Task key={t.id} task={t} onRightClick={handleRightClick}
                    onLeftClick={handleLeftClick} />)
                }
            </section>
            <TaskForm 
                onDateChange={handleDateChange}
                onDescChange={handleDescChange}
                onTimeChange={handleTimeChange}
                onSubmit={handleSubmit}
            />
        </main>
    );
}

export default List;