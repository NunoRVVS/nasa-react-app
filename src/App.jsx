import { useEffect, useState } from 'react'
import Main from './components/main'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  function handleToggleModal () {
    setShowModal(!showModal)
  }

//The useEffect allows us to fetch data from API
  useEffect(() => {
    async function fetchAPIData() {
      const NASA_KEY = import.meta.env.VITE_NASA_API_KEY
      const url = 'https://api.nasa.gov/planetary/apod' + 
      `?api_key=${NASA_KEY}`

      const today = (new Date()).toDateString()
      const localKey = `NASA-${today}`

      try {
          const storedData = localStorage.getItem(localKey);

          if (storedData) {
          try {
            // Attempt to parse the stored data.  If it's not valid JSON,
            // the catch block will handle the error.
            const apiData = JSON.parse(storedData)
            setData(apiData)
            console.log('Fetched from cache today')
            return
          } catch (parseError) { 
          // localStorage.clear()
            console.error("Error parsing data from localStorage:", parseError);
            // Optionally, clear the corrupted localStorage entry:
            localStorage.removeItem(localKey); 
          }
        }
        
        //If no valid data in local storage, or parse fails, then fetch from API.
        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`); // Handle non-2xx responses
        }

        const apiData = await res.json()
        localStorage.setItem(localKey, JSON.stringify(apiData))
        setData(apiData)
        console.log('Fetched from API today')
      } catch (err) {
        console.error("Error fetching or parsing data:", err); // More robust error handling
        // You might want to set a default state or display an error message to the user
      }
    }
    fetchAPIData()
  }, [])

  return (
    <>
      {data ? (<Main data={data} />): (
        <div className='loadingState'>
          <i className="fa-solid fa-gear"></i>
        </div>
      )}
      { showModal && (
        <Sidebar data={data} handleToggleModal={handleToggleModal} />
      )}
      {data && ( 
        <Footer data={data} handleToggleModal={handleToggleModal} />
      )}
    </>
  )
}

export default App
