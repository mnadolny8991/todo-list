import { useState } from 'react';
import Task from './Task'

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

let id = 5;

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
    }

    function handleRightClick(e, id) {
        setTasks(tasks.map(t => {
            if (t.id === id) {
                let newStatus = ''
                if (t.status === 'planned') newStatus = 'in progress';
                else if (t.status === 'in progress') newStatus = 'complete';
                setStatus(newStatus);
                return { ...t, status: newStatus };
            }
            return t;
        }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        console.log(inputTask);
        setTasks([...tasks, inputTask]);
        setStatus('planned');
    }

    function handleInputChange(e) {
        const val = String(e.target.value);
        const name = e.target.name;
        if (name === 'date') {
            const date = val.split('-');
            let newDate = new Date(inputTask.due);
            newDate.setFullYear(date[0]);
            newDate.setMonth(date[1]);
            newDate.setDate(date[2]);
            setInputTask({ ...inputTask, due: newDate })
        }
        if (name === 'time') {
            const time = val.split(':');
            let newDate = new Date(inputTask.due);
            newDate.setHours(time[0], time[1]);
            setInputTask({ ...inputTask, due: newDate });
        }
        if (name === 'description') {
            setInputTask({ ...inputTask, description: val })
        }
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
                    t.status === status && <Task key={t.id} task={t} onTaskClick={handleRightClick} />)
                }
            </section>
            <form className='task-form container' onSubmit={e => handleSubmit(e)}>
                <div className='task-form__left'>
                    <input className='task-form__item' name='description'
                        onChange={e => handleInputChange(e)} type='text' required></input>
                    <div className='task-form__datetime'>
                        <input className='task-form__item' name='date'
                            onChange={e => handleInputChange(e)} type='date' required></input>
                        <input className='task-form__item' name='time'
                            onChange={e => handleInputChange(e)} type='time' required></input>
                    </div>
                </div>
                <button className='task-form__submit' type='submit'>Add</button>
            </form>
        </main>
    );
}

export default List;