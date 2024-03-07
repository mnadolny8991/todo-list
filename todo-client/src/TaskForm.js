import add from './add.png';

function TaskForm( {
    onDateChange,
    onTimeChange,
    onDescChange,
    onSubmit
} ) {
    return (
        <form className='task-form container' onSubmit={e => onSubmit(e)}>
            <div className='task-form__left'>
                <input className='task-form__item' name='description'
                    onChange={e => onDescChange(e)} type='text' required></input>
                <div className='task-form__datetime'>
                    <input className='task-form__item' name='date'
                        onChange={e => onDateChange(e)} type='date' required></input>
                    <input className='task-form__item' name='time'
                        onChange={e => onTimeChange(e)} type='time' required></input>
                </div>
            </div>
            <button className='task-form__submit' type='submit'>
                <img src={add} alt='a' width='20px'></img>
            </button>
        </form>
    );
}

export default TaskForm;