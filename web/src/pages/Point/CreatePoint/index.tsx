import React, { useState, useEffect, ChangeEvent } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import api from '../../../services/api'

import logo from '../../../assets/logo.svg'
import './styles.css'

interface IItem {
  id: number
  title: string
  image_url: string
}

interface IIbgeUFResponse {
  sigla: string
}

interface IIbgeCityResponse {
  nome: string
}

const CreatePoint = () => {
  const [items, setItems] = useState<IItem[]>([])
  const [ufs, setUfs] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0])

  const [selectedUf, setSelectedUf] = useState('0')
  const [selectedCity, setSelectedCity] = useState('0')
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0])
  const [selectedItems, setSelectedItems] = useState<number[]>([])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
  })

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords

      setInitialPosition([latitude, longitude])
      setSelectedPosition([latitude, longitude])
    })
  }, [])

  useEffect(() => {
    api.get('items').then((response) => {
      setItems(response.data)
    })
  }, [])

  useEffect(() => {
    axios.get<IIbgeUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then((response) => {
      const ufsInitials = response.data.map((uf) => uf.sigla)

      setUfs(ufsInitials)
    })
  }, [])

  useEffect(() => {
    if (selectedUf === '0') return

    axios
      .get<IIbgeCityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then((response) => {
        const cityNames = response.data.map((city) => city.nome)

        setCities(cityNames)
      })
  }, [selectedUf])

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value
    setSelectedUf(uf)
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value
    setSelectedCity(city)
  }

  function handleMapClick(event: LeafletMouseEvent) {
    setSelectedPosition([event.latlng.lat, event.latlng.lng])
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target

    setFormData({ ...formData, [name]: value })
  }

  function handleSelectItem(id: number) {
    const alreadySelected = selectedItems.includes(id)

    if (alreadySelected) {
      const filteredItems = selectedItems.filter((item) => item !== id)
      setSelectedItems(filteredItems)
      return
    }
    setSelectedItems([...selectedItems, id])
  }

  return (
    <div id='page-create-point'>
      <header>
        <img src={logo} alt='Ecoleta' />
        <Link to='/'>
          <FiArrowLeft />
          Go back home
        </Link>
      </header>
      <form>
        <h1>
          Register <br /> collect point
        </h1>
        <fieldset>
          <legend>
            <h2>Info</h2>
          </legend>
          <div className='field'>
            <label htmlFor='name'>Entity name</label>
            <input type='text' name='name' id='name' onChange={handleInputChange} />
          </div>
          <div className='field-group'>
            <div className='field'>
              <label htmlFor='email'>E-mail</label>
              <input type='email' name='email' id='email' onChange={handleInputChange} />
            </div>
            <div className='field'>
              <label htmlFor='whatsapp'>Whatsapp</label>
              <input type='number' name='whatsapp' id='whatsapp' onChange={handleInputChange} />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Address</h2>
            <span>Select address in the map</span>
          </legend>

          <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            <Marker position={selectedPosition} />
          </Map>

          <div className='field-group'>
            <div className='field'>
              <label htmlFor='uf'>State</label>
              <select name='uf' id='uf' value={selectedUf} onChange={handleSelectUf}>
                <option value='0'>Select a state</option>
                {ufs.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>
            <div className='field'>
              <label htmlFor='city'>City</label>
              <select name='city' id='city' value={selectedCity} onChange={handleSelectCity}>
                <option value='0'>Select a city</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Collect items</h2>
            <span>Select one or more items below</span>
          </legend>
          <ul className='items-grid'>
            {items.map((item) => (
              <li
                key={item.id}
                onClick={() => handleSelectItem(item.id)}
                className={selectedItems.includes(item.id) ? 'selected' : ''}
              >
                <img src={item.image_url} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>
        <button type='submit'>Save collect point</button>
      </form>
    </div>
  )
}

export default CreatePoint
