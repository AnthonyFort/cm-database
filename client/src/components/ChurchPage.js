

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ErrorModal from './ErrorModal'
import axiosAuth from '../lib/axios'
import { Button, Container, InputGroup, Card, ListGroup, Form } from 'react-bootstrap'

export default function ChurchPage({ currentUser, getCurrentUser }) {

  const [churchData, setChurchData] = useState({ past_services: [] })
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const { id } = useParams()
  const [showFormFields, setShowFormFields] = useState(false)
  const [serviceInfoChanged, setServiceInfoChanged] = useState(false)
  const [serviceToUpdate, setServiceToUpdate] = useState(null)
  const [formType, setFormType] = useState('create')
  const [newService, setNewService] = useState({
    date_of_service: '',
    type_of_service: '',
    music_items: [
      {
        title: '',
        composer: '',
        keywords: [
          {
            keyword: '',
          }
        ],
        related_readings: [
          {
            book: '',
            chapter: '',
            start_verse: '',
            end_verse: '',
          }
        ],
      }
    ],
  })
  async function getChurchData() {
    try {
      const { data } = await axiosAuth.get(`/api/auth/${id}/`)
      if (data.past_services) {
        data.past_services.sort((a, b) => {
          return new Date(b.date_of_service) - new Date(a.date_of_service)
        })
      }
      setChurchData(data)
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    getChurchData()
  }, [id])

  useEffect(() => {
    getCurrentUser()
  }, [])


  // This is where form fields are updated

  const handleMusicItemChange = (index, updates, keywordIndex, readingIndex) => {
    const updatedMusicItems = [...newService.music_items]
    let itemToUpdate = updatedMusicItems[index]
    if (typeof keywordIndex !== 'undefined') {
      itemToUpdate = itemToUpdate.keywords[keywordIndex]
    } else if (typeof readingIndex !== 'undefined') {
      if (!itemToUpdate.related_readings[readingIndex]) {
        itemToUpdate.related_readings[readingIndex] = {
          book: '',
          chapter: '',
          start_verse: '',
          end_verse: '',
        }
      }
      itemToUpdate = itemToUpdate.related_readings[readingIndex]
    }
    Object.assign(itemToUpdate, updates)
    setNewService({ ...newService, music_items: updatedMusicItems })
  }

  // This is where new form fields are created or deleted

  const addMusicItem = () => {
    const updatedMusicItems = [...newService.music_items]
    updatedMusicItems.push({
      title: '',
      composer: '',
      keywords: [],
      related_readings: [
        {
          book: '',
          chapter: '',
          start_verse: '',
          end_verse: '',
        }
      ],
    })
    setNewService({ ...newService, music_items: updatedMusicItems })
  }

  const addKeyword = (index) => {
    const updatedMusicItems = [...newService.music_items]
    if (!updatedMusicItems[index].keywords) {
      updatedMusicItems[index].keywords = []
    }
    updatedMusicItems[index].keywords.push({ keyword: '' })
    setNewService({ ...newService, music_items: updatedMusicItems })
  }

  const addReading = (index) => {
    const updatedMusicItems = [...newService.music_items]
    if (!updatedMusicItems[index].related_readings) {
      updatedMusicItems[index].related_readings = []
    }
    updatedMusicItems[index].related_readings.push({
      book: '',
      chapter: '',
      start_verse: '',
      end_verse: '',
    })
    setNewService({ ...newService, music_items: updatedMusicItems })
  }

  const removeMusicItem = (index) => {
    const updatedMusicItems = [...newService.music_items]
    updatedMusicItems.splice(index, 1)
    setNewService({ ...newService, music_items: updatedMusicItems })
  }

  const removeKeyword = (index, keywordIndex) => {
    const updatedMusicItems = [...newService.music_items]
    updatedMusicItems[index].keywords.splice(keywordIndex, 1)
    setNewService({ ...newService, music_items: updatedMusicItems })
  }

  const removeReading = (index, ReadingIndex) => {
    const updatedMusicItems = [...newService.music_items]
    updatedMusicItems[index].related_readings.splice(ReadingIndex, 1)
    setNewService({ ...newService, music_items: updatedMusicItems })
  }

  async function deleteService(serviceId) {
    try {
      await axiosAuth.delete(`/api/services/${serviceId}/`)
      const remainingServices = churchData.past_services.filter(item => (
        item.id !== parseInt(serviceId)
      ))
      setChurchData({ ...churchData, past_services: remainingServices })
      setServiceInfoChanged(!serviceInfoChanged)
    } catch (error) {
      setShowErrorModal(true)
    }
  }

  const handleShowUpdate = (service) => {
    setServiceToUpdate(service)
    setShowFormFields(true)
    setFormType('update')
  }

  const handleValidation = () => {
    if (!newService.date_of_service || !newService.type_of_service || !newService.music_items.length) {
      setErrorMessage('Please fill out all fields.')
      setShowErrorModal(true)
      return false
    }
    return true
  }

  const handleCreateSubmit = async (event) => {
    event.preventDefault()

    if (!handleValidation()) {
      return
    }

    try {
      const { data } = await axiosAuth.post('/api/services/', newService)
      getChurchData()
      setShowFormFields(false)
      setServiceToUpdate(null)
    } catch (error) {
      console.error(error)
      setErrorMessage(error.message)
      setShowErrorModal(true)
    }
  }

  const handleUpdateSubmit = async (event) => {
    event.preventDefault()

    if (!handleValidation()) {
      return
    }

    try {
      const { data } = await axiosAuth.put(`/api/services/${serviceToUpdate.id}/`, newService)
      getChurchData()
      setShowFormFields(false)
      setServiceToUpdate(null)
    } catch (error) {
      console.error(error)
      setErrorMessage(error.message)
      setShowErrorModal(true)
    }
  }


  if (!churchData) return <div>Unauthorised</div>

  return (
    <>
      {showErrorModal && <ErrorModal show={showErrorModal} onClose={() => setShowErrorModal(false)} errorMessage={errorMessage} />}
      <Container>
        <h1>{churchData.church}</h1>
        {currentUser && currentUser.id === churchData.id && (
          <>

            <Button onClick={() => {
              setShowFormFields(!showFormFields)
              setFormType('create')
            }}>
              {showFormFields ? 'Hide Form' : 'Add Service'}
            </Button>

            {showFormFields && (
              <Form onSubmit={formType === 'create' ? handleCreateSubmit : handleUpdateSubmit}>
                <Form.Group>
                  <Form.Label>Date of Service:</Form.Label>
                  <Form.Control
                    type="date"
                    value={newService.date_of_service}
                    onChange={event => setNewService({ ...newService, date_of_service: event.target.value })}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Type of Service:</Form.Label>
                  <Form.Control
                    type="text"
                    value={newService.type_of_service}
                    onChange={event => setNewService({ ...newService, type_of_service: event.target.value })}
                  />
                </Form.Group>
                <Button variant="secondary" onClick={addMusicItem} className="m-3">Add Music Item</Button>
                {Array.isArray(newService.music_items) && newService.music_items.map((musicItem, index) => (
                  <div key={index}>

                    <InputGroup className="mb-3">
                      <InputGroup.Text>Title:</InputGroup.Text>
                      <Form.Control
                        value={musicItem.title}
                        onChange={event => handleMusicItemChange(index, { title: event.target.value })}
                        aria-label="Title of the Music Item"
                      />

                    </InputGroup>

                    <InputGroup className="mb-3">
                      <InputGroup.Text>Composer:</InputGroup.Text>
                      <Form.Control
                        value={musicItem.composer}
                        onChange={event => handleMusicItemChange(index, { composer: event.target.value })}
                        aria-label="Composer of the Music Item"
                      />
                    </InputGroup>

                    <div>
                      {Array.isArray(musicItem.keywords) && musicItem.keywords.map((k, keywordIndex) => (
                        <InputGroup key={keywordIndex} className="mb-3">
                          <InputGroup.Text>Keyword:</InputGroup.Text>
                          <Form.Control
                            value={k.keyword}
                            onChange={e => handleMusicItemChange(index, { keyword: e.target.value }, keywordIndex)}
                            aria-label="Keyword for the Music Item"
                          />
                          {musicItem.keywords.length > 1 && (
                            <Button variant="outline-danger" onClick={() => removeKeyword(index, keywordIndex)}>Remove Keyword</Button>
                          )}
                        </InputGroup>
                      ))}
                      <Button variant="secondary" className="m-3" onClick={() => addKeyword(index)}>Add Keyword</Button>
                    </div>

                    <div>
                      <h4>Related Readings</h4>
                      {Array.isArray(musicItem.related_readings) && musicItem.related_readings.map((reading, readingIndex) => (
                        <div key={readingIndex}>
                          <InputGroup className="mb-3">
                            <InputGroup.Text>Book:</InputGroup.Text>
                            <Form.Control
                              value={reading.book}
                              onChange={event => handleMusicItemChange(index, { book: event.target.value }, undefined, readingIndex)}
                              aria-label="Book of the Related Reading"
                            />
                          </InputGroup>

                          <InputGroup className="mb-3">
                            <InputGroup.Text>Chapter:</InputGroup.Text>
                            <Form.Control
                              value={reading.chapter}
                              onChange={event => handleMusicItemChange(index, { chapter: event.target.value }, undefined, readingIndex)}
                              aria-label="Chapter of the Related Reading"
                            />
                          </InputGroup>

                          <InputGroup className="mb-3">
                            <InputGroup.Text>Start Verse:</InputGroup.Text>
                            <Form.Control
                              value={reading.start_verse}
                              onChange={event => handleMusicItemChange(index, { start_verse: event.target.value }, undefined, readingIndex)}
                              aria-label="Start Verse of the Related Reading"
                            />
                          </InputGroup>

                          <InputGroup className="mb-3">
                            <InputGroup.Text>End Verse:</InputGroup.Text>
                            <Form.Control
                              value={reading.end_verse}
                              onChange={event => handleMusicItemChange(index, { end_verse: event.target.value }, undefined, readingIndex)}
                              aria-label="End Verse of the Related Reading"
                            />
                            {musicItem.related_readings.length > 1 && (
                              <Button variant="outline-danger" className="m-3" onClick={() => removeReading(index, readingIndex)}>Remove Reading</Button>
                            )}
                          </InputGroup>
                        </div>
                      ))}
                      <Button variant="secondary" className="m-3" onClick={() => addReading(index)}>Add Reading</Button>

                    </div>
                    {newService.music_items.length > 1 && (
                      <Button variant="outline-danger" className="m-3" onClick={() => removeMusicItem(index)}>Remove Music Item</Button>
                    )}
                  </div>
                ))}

                <Button type="submit" className="m-3">
                  {formType === 'create' ? 'Add Service' : 'Update Service'}
                </Button>
              </Form>
            )}

          </>
        )}
        <section>
          <h2>Past Services</h2>
          {churchData.past_services && Array.isArray(churchData.past_services) && churchData.past_services.map((service) => (
            <Card className="mb-4" key={service.id}>
              <Card.Header>{service.date_of_service} - {service.type_of_service}</Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  {service.music_items.map((item) => (
                    <ListGroup.Item key={item.id}>
                      <h3><strong>{item.title}</strong> by {item.composer}</h3>
                      <ul>
                        <h4>Keywords</h4>
                        {item.keywords.map((keyword, index) => (
                          <li key={index}>
                            {keyword.keyword}
                          </li>
                        ))}
                      </ul>
                      <ul>
                        <h4>Related Readings</h4>
                        {item.related_readings && Array.isArray(item.related_readings) && item.related_readings.map((reading, index) => (
                          <li key={index}>
                            <h5>{reading.book} {reading.chapter}:{reading.start_verse}-{reading.end_verse}</h5>
                            <p>{reading.text}</p>
                          </li>
                        ))}
                      </ul>
                    </ListGroup.Item>

                  ))}
                </ListGroup>
              </Card.Body>
              <Button className="btn-primary m-2" onClick={() => handleShowUpdate(service)}>Update Service</Button>
              <Button variant="outline-danger" className="m-3" onClick={() => deleteService(service.id)}>Delete Service</Button>
            </Card>
          ))}
        </section>
      </Container>
    </>
  )
}
