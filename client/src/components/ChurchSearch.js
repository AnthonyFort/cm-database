import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default function SearchUsers() {

  const [allChurches, setAllChurches] = useState()
  const [churches, setChurches] = useState()


  useEffect(() => {
    async function getUserData() {
      try {
        const { data } = await axios.get('/api/auth')
        data.sort()
        setAllChurches(data)
        setChurches(data)
      } catch (error) {
        console.log(error)
      }
    }
    getUserData()
  }, [])

  function handleKeyup(event) {
    const selectedChurches = [...allChurches]
    const newSearchedChurches = selectedChurches.filter(church => church.church.toLowerCase().includes(event.target.value.toLowerCase()))
    setChurches(newSearchedChurches)
  }



  const [searchInput, setSearchInput] = useState('')
  const [searchBy, setSearchBy] = useState('church') 
  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value)
  }
  const handleSearchByChange = (event) => {
    setSearchBy(event.target.value)
  }

  return (
    <div>
      <div className='search-header'>
        <h1>Search Churches</h1>
        <input onKeyUp={handleKeyup} placeholder='Search name' />
      </div>
      <section className='user-section'>
        {churches && churches.map(church => {
          return (
            <div key={church.id} value={church._id}>
              {/* <Link to={`/users/${user._id}`}>{user.username}</Link> */}
            </div>
          )
        })}
      </section>
    </div>
  )
}