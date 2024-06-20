
import './App.css'
import Camera from './components/Camera.jsx'




function App() {
 

  return (
    <>
    <div className="bg-gray-900 h-screen p-5 bg-[url('assets/image3.jpg')] bg-no-repeat bg-center bg-cover">
      <p className="text-yellow-400 text-center text-6xl md:text-6xl font-['Open_Sans'] font-black mb-8 mt-3">Detect Anything...</p>
      <Camera/>



    </div>
    
     
    </>
  )
}

export default App
