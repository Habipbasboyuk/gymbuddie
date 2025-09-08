import buttonIcon from '../assets/icons/excersize/icons8-bodybuilder-48.png';
import optionIcon from '../assets/icons/icons8-menu-vertical-50.png';
import { Link } from 'react-router-dom';

function Training () {

    return ( 
        <>
        <Link className='training__card-link' to="../workout">

        <article className="training">
            <div className="training__header">
                <img className="training__button-icon training-icon" src={buttonIcon} alt="" />
                <button className="btn training__button">
                    <img className="training__button-icon btn-option" src={optionIcon} alt="" />
                </button>
            </div>

            <p className="training__title">Chest & bicep</p>
            <p className="training__info">4 excercises</p>
        </article>

        </Link>

        </>
     );
}

export default Training;