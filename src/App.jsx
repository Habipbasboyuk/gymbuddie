import './styles/App.css';
import Training from './components/training.jsx';
import Footer from './components/footer.jsx';
import Workout from './workout.jsx';
import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchWorkouts, postWorkout } from './data/data.jsx';

const API_TOKEN = import.meta.env.VITE_API_TOKEN;
const API_URL_WORKOUTS = import.meta.env.VITE_API_URL_WORKOUTS;

function App() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newWorkoutFormVisible, setNewWorkoutFormVisible] = useState(true);

  useEffect(() => {
    fetchWorkouts(API_URL_WORKOUTS, API_TOKEN)
      .then((workoutsData) => {
        setWorkouts(workoutsData || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (newWorkoutFormVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [newWorkoutFormVisible]);

  const handleNewWorkout = async (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    try {
      setLoading(true);
      await postWorkout(API_URL_WORKOUTS, API_TOKEN, { title });
      const workoutsData = await fetchWorkouts(API_URL_WORKOUTS, API_TOKEN);
      setWorkouts(workoutsData || []);
      setNewWorkoutFormVisible(false);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="ap</div>p__title">
        GymTrack <br /> <span className="app__title-highlight">Maatje</span>
      </h1>
      <p className="app__subtitle">Track your workouts and prestations</p>
      <button onClick={() => setNewWorkoutFormVisible(true)} className="btn app__new-workout-btn">New workout</button>

      {newWorkoutFormVisible && (
        <section className="post">
          <button className='btn post__form-close' onClick={() => setNewWorkoutFormVisible(false)}>Close</button>
          <h2 className="post__title">New <br /> <span className='post__title-highlight'>Workout</span></h2>
          <form className='post__form' onSubmit={handleNewWorkout}>
            <label className='post__form-label'>Name</label>
            <input className='post__form-input' type="text" name="title" required />

            <label className='post__form-label'>exercise(s)</label>
            <input className='post__form-input' type="text" name="exercises" required />

            <button type="submit" className="btn post__form-btn">Add workout</button>
          </form>
        </section>
      )}

      <Routes>
        <Route
          path="/"
          element={
            <section className="app__trainings">
              {loading && <div>Loading...</div>}
              {error && <div>Error: {error.message}</div>}
              {!loading && !error && workouts.map((workout) => (
                <Training
                  key={workout.id}
                  name={workout.title}
                  exerciseCount={workout.exercises?.length || 0}
                />
              ))}
            </section>
          }
        />
        <Route path="/workout" element={<Workout />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;