import right from './right.png';

function getRemainingTime(start, end) {
    let timeDiff = end.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    let days = Math.floor(timeDiff / oneDay);
    let years = Math.floor(days / 365.25);
    days -= years * 365.25;
    let months = Math.floor(days / 30.44);
    days -= months * 30.44;

    years = Math.round(years);
    months = Math.round(months);
    days = Math.round(days);

    return {
        years: years,
        months: months,
        days: days
    };
}

function Task({ task, onRightClick, onLeftClick, onDeleteClick, onEditClick }) {

    function formatDate(date) {
        const now = new Date();
        if (now.getTime() > date.getTime()) {
            return 'after deadline';
        }
        const remains = getRemainingTime(now, date);
        let remainsString = '';
        if (remains.years !== 0) {
            remainsString += `${remains.years} years, `;
        }
        if (remains.months !== 0) {
            remainsString += `${remains.months} months, `;
        }
        if (remains.days !== 0) {
            remainsString += `${remains.days} days`;
        }
        if (remainsString === '') remainsString = '0 days';
        return remainsString;
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
                    {task.status !== 'planned' && 
                            <img  
                                onClick={(e, id) => onLeftClick(e, task.id)}
                                className='task__push-left' 
                                width='15px' 
                                src={right} 
                                alt='right'>
                            </img>}
                    <div class='task__info'>
                        <div className='task__title'>{task.description}</div>
                        <div className='task__due'>
                            {task.due.toDateString()}
                        </div>
                        <div className='task__due'>
                            {
                                formatDate(task.due)
                            }
                        </div>
                    </div>
                    <button className='task__btn task__btn--delete' onClick={e => onDeleteClick(e, task.id)}>Delete</button>
                    <button className='task__btn task__btn--update' onClick={e => onEditClick(e, task.id)}>Edit</button>
                </div>
                <div className='task__right'>
                    <div>
                        {formatHour(task.due)}
                    </div>
                    {task.status !== 'complete' && 
                        <img onClick={e => onRightClick(e, task.id)} 
                            className='task__push-right' width='15px' src={right} alt='right'></img>}
                </div>
            </article>
        </div>
    );
}

export default Task;