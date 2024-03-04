import { useState } from 'react';
import Task from './Task';
import TaskForm from './TaskForm';

const statuses = ['Planned', 'In Progress', 'Complete'];
const initialTasks = [
    {
        id: 0,
        description: 'Do the loundary',
        due: new Date(2024, 2, 29, 23, 59, 59),
        status: 'complete'
    },
    {
        id: 1,
        description: 'Become software engineer',
        due: new Date(2025, 5, 20, 22, 0, 0, 0),
        status: 'in progress'
    },
    {
        id: 2,
        description: 'Finish your thesis',
        due: new Date(2026, 5, 20, 22, 0, 0, 0),
        status: 'complete'
    },
    {
        id: 3,
        description: 'Beat the world record',
        due: new Date(2029, 5, 20, 22, 0, 0, 0),
        status: 'in progress'
    },
    {
        id: 4,
        description: 'Become an educated genleman',
        due: new Date(2024, 5, 20, 22, 0, 0, 0),
        status: 'planned'
    },
    {
        id: 5,
        description: 'Start a new business',
        due: new Date(2024, 5, 20, 22, 0, 0, 0),
        status: 'planned'
    }
]

let id = 6; 

function List() {
    const [status, setStatus] = useState('planned');
    const [tasks, setTasks] = useState(initialTasks);
    const [inputTask, setInputTask] = useState({ status: 'planned' });

    function statusEntryClassNames(entry) {
        return 'status__entry ' + 
            ((status === entry.toLowerCase()) ? 'status__entry--selected' : '');
    }

    function handleStatusEntryClick(e) {
        setStatus(String(e.target.innerHTML).toLowerCase());
        console.log(String(e.target.innerHTML).toLowerCase());
        // setStatus('in progress');
    }

    function handleRightClick(e, id) {
        let newStatus = 'planned';
        setTasks(tasks.map(t => {
            if (t.id === id) {
                if (t.status === 'planned') newStatus = 'in progress';
                else if (t.status === 'in progress') newStatus = 'complete';
                return { ...t, status: newStatus };
            }
            return t;
        }));
    }

    function handleLeftClick(e, id) {
        let newStatus = 'complete';
        setTasks(tasks.map(t => {
            if (t.id === id) {
                if (t.status === 'complete') newStatus = 'in progress';
                else if (t.status === 'in progress') newStatus = 'planned';
                return { ...t, status: newStatus };
            }
            return t;
        }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        setTasks([...tasks, {...inputTask, id: id++}]);
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