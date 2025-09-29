import buttonIcon from '../assets/icons/excersize/icons8-bodybuilder-48.png';
import optionIcon from '../assets/icons/icons8-menu-vertical-50.png';
import { Link } from 'react-router-dom';
import { useState } from 'react';


function Training({ id, name, exerciseCount, onDelete, documentId }) {
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);

    return (
        <article className="training">
            <div className="training__header">
                <img className="training__button-icon training-icon" src={buttonIcon} alt="" />
                <button
                    className="btn training__button"
                    onClick={() => setIsOptionsOpen((prev) => !prev)}
                >
                    <img
                        className="training__button-icon btn-option"
                        src={optionIcon}
                        alt=""
                    />
                </button>
            </div>
            <p className="training__title">{name}</p>
            <p className="training__info">{exerciseCount} exercises</p>
<Link className="training__card-link" to={`/workout/${id}`}>
  <button className="btn training__start-btn">Start workout</button>
</Link>

            {isOptionsOpen && (
                <div className="training__options-menu">
                    <button className="btn training__option-edit">Edit</button>
                    <button onClick={() => onDelete(documentId)} className="btn training__option-delete">Delete</button>
                </div>
            )}
        </article>
    );
}

export default Training;