
import './styles/App.css'
import Training from './components/training.jsx'
import Footer from './components/footer.jsx'
function App() {

  return (
    <>
      <h1 className="app__title">
      GymTrack <br /> <span className="app__title-highlight">Maatje</span>
      </h1>
      <p className="app__subtitle">Track your workouts and prestations</p>
      <button className="btn app__new-workout-btn">New workout</button>

    <section className="app__trainings">
      <Training />
      <Training />
      <Training />
    </section>
      
      <Footer />
    </>
    )
}

export default App
