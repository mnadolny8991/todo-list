import right from './right.png';

function getRemainingTime(due) {
    let date1 = new Date();
    let date2 = due;
    let diff = new Date(date2.getTime() - date1.getTime());

    let years = diff.getUTCFullYear() - 1970;
    let months = diff.getUTCMonth();
    let days = diff.getUTCDate()-1;

    return [years, months, days];
}

function Task({ task, onTaskClick }) {

    function formatDate(date) {
        const [years, months, days] = getRemainingTime(date);
        const notActual = years < 0 || months < 0 || days < 0
        const remainingString = notActual ? " time passed" 
            : ` (${years > 0 ? years + " years, " : ""}` +
              `${months > 0 ? months + " months, " : ""}` + 
              `${days > 0 ? days + " days" : ""} remaining)`;
        return `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}` +
            remainingString;
    }

    function formatHour(date) {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return (String(hours).length > 1 ? hours : '0' + hours) + ":" +
             (String(minutes).length > 1 ? minutes : '0' + minutes);
    }

    return (
        <div>
            <article className='tasks__task'>
                <div className='task__left'>
                    <div className='task__title'>{task.description}</div>
                    <div className='task__due'>
                        {
                            formatDate(task.due)
                        }
                    </div>
                </div>
                <div className='task__right'>
                    <div>
                        {formatHour(task.due)}
                    </div>
                    {task.status !== 'complete' && 
                        <img onClick={e => onTaskClick(e, task.id)} 
                            className='task__push' width='15px' src={right} alt='right'></img>}
                </div>
            </article>
        </div>
    );
}

export default Task;