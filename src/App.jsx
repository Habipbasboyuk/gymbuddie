
import './styles/App.css'
import Training from './components/training.jsx'
import Footer from './components/footer.jsx'
function App() {

  return (
    <>
      <h1>GymTrack <br /> Maatje</h1>
      <p>Track your workouts and prestations</p>
      <button>New workout</button>

      <Training />
      <Training />
      <Training />
      <Footer />
    </>
  )
}

export default App
