import './styles/App.css';
import Training from './components/training.jsx';
import Footer from './components/footer.jsx';
import Workout from './workout.jsx';
import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchWorkoutsWithSets, fetchExercises, postWorkout, deleteWorkout } from './data/data.jsx';

const API_TOKEN = import.meta.env.VITE_API_TOKEN;
const API_URL_WORKOUTS = import.meta.env.VITE_API_URL_WORKOUTS;
const API_URL_EXERCISES = import.meta.env.VITE_API_URL_EXERCISES;
const API_URL_SETS = import.meta.env.VITE_API_URL_SETS;

function App() {
  const [exercises, setExercises] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newWorkoutFormVisible, setNewWorkoutFormVisible] = useState(false);

  // Map data zodat elk object een documentId property heeft
  const mapDocumentId = arr => arr.map(obj => ({
  ...obj,
  documentId: obj.documentId || obj.id, // workout documentId
  exercises: obj.exercises?.map(ex => ({
    ...ex,
    documentId: ex.documentId || ex.id, // exercise documentId
    sets: ex.sets?.map(set => ({
      ...set,
      documentId: set.documentId || set.id, // <-- SET DOCUMENTID MAPPING!
    })) ?? [],
  })) ?? [],
}));

// Gebruik deze mapping in refreshWorkouts:
const refreshWorkouts = async () => {
  setLoading(true);
  try {
    const workoutsData = await fetchWorkoutsWithSets(API_URL_WORKOUTS, API_TOKEN);
    setWorkouts(mapDocumentId(workoutsData || [])); // <-- Gebruik de mapping
  } catch (err) {
    setError(err);
  }
  setLoading(false);
};

  useEffect(() => {
    refreshWorkouts();
  }, []);

  useEffect(() => {
    fetchExercises(API_URL_EXERCISES, API_TOKEN)
      .then((exercisesData) => {
        const mappedExercises = exercisesData?.map(ex => ({
          ...ex,
          documentId: ex.id,
        })) || [];
        setExercises(mappedExercises);
      })
      .catch(() => {
        setExercises([]);
      });
  }, []);

  // Disable scroll when form is open
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

    // Verzamel alle aangevinkte exercises (numeriek id!)
    const checked = Array.from(e.target.exercises)
      .filter(input => input.checked)
      .map(input => Number(input.value));

    try {
      setLoading(true);

      // Maak de workout aan
      await postWorkout(API_URL_WORKOUTS, API_TOKEN, { title, exercises: checked });

      // Voeg een default set toe voor elke geselecteerde exercise
      const selectedExercises = exercises.filter(ex => checked.includes(ex.id));

      for (const exercise of selectedExercises) {
  const body = {
    data: {
      setNumber: 1,
      previous: "-",
      kg: 1,        // <-- verander 0 naar 1
      rep: 1,
      done: false,
      exercise: exercise.id,
    },
  };

  console.log("Set POST body:", body);

  try {
    const response = await fetch(API_URL_SETS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      console.error("Failed to create set:", response.status, response.statusText);
    }
  } catch (setError) {
    console.error("Error creating set:", setError);
  }
}

      await refreshWorkouts();
      setNewWorkoutFormVisible(false);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (documentId) => {
    try {
      setLoading(true);
      const workout = workouts.find(w => w.documentId === documentId);
      if (!workout) throw new Error('Workout not found');
      await deleteWorkout(API_URL_WORKOUTS, API_TOKEN, workout.documentId);
      await refreshWorkouts();
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <h1 className="app__title">
              GymTrack <br /> <span className="app__title-highlight">Maatje</span>
            </h1>
            <p className="app__subtitle">Track your workouts and prestations</p>
            <button
              onClick={() => setNewWorkoutFormVisible(true)}
              className="btn app__new-workout-btn"
            >
              New workout
            </button>

            {newWorkoutFormVisible && (
              <section className="post">
                <button className='btn post__form-close' onClick={() => setNewWorkoutFormVisible(false)}>Close</button>
                <h2 className="post__title">New <br /> <span className='post__title-highlight'>Workout</span></h2>
                <form className='post__form' onSubmit={handleNewWorkout}>
                  <label className='post__form-label'>Name</label>
                  <input className='post__form-input' type="text" name="title" required />

                  <label className='post__form-label'>exercise(s)</label>
                  <div className='post__form-exercises'>
                    {exercises.map((exercise) => (
                      <div key={exercise.documentId} className="post__form-exercise-checkbox">
                        <input
                          type="checkbox"
                          id={`exercise-${exercise.documentId}`}
                          name="exercises"
                          value={exercise.id}
                        />
                        <label htmlFor={`exercise-${exercise.documentId}`}>{exercise.name}</label>
                      </div>
                    ))}
                  </div>

                  <button type="submit" className="btn post__form-btn">Add workout</button>
                </form>
              </section>
            )}

            <section className="app__trainings">
              {loading && <div>Loading...</div>}
              {error && <div>Error: {error.message}</div>}
              {!loading && !error && workouts.map((workout) => (
                <Training
                  key={workout.documentId}
                  id={workout.documentId}
                  documentId={workout.documentId}
                  name={workout.title}
                  exerciseCount={workout.exercises?.length || 0}
                  onDelete={handleDelete}
                />
              ))}
            </section>
            <Footer />
          </>
        }
      />
      <Route path="/workout/:documentId" element={<Workout workouts={workouts} refreshWorkouts={refreshWorkouts} />} />
    </Routes>
  );
}

export default App;