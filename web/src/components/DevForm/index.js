import React, { useState, useEffect } from 'react';
import api from '../../services/api';

function DevForm({ onSubmit }) {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const [github_username, setGithubUsername] = useState('');
  const [techs, setTechs] = useState('');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;

        setLatitude(latitude);
        setLongitude(longitude);
      },
      err => {
        console.log(err);
      },
      {
        timeout: 30000
      }
    );
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    const response = await api.post('/devs', {
      github_username,
      techs,
      latitude,
      longitude
    });

    setGithubUsername('');
    setTechs('');

    onSubmit(response.data);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className='input-block'>
        <label htmlFor='github_username'>Github User</label>
        <input
          name='github_username'
          id='github_username'
          required
          value={github_username}
          onChange={e => setGithubUsername(e.target.value)}
        />
      </div>
      <div className='input-block'>
        <label htmlFor='techs'>Tecnologies</label>
        <input
          name='techs'
          id='techs'
          required
          value={techs}
          onChange={e => setTechs(e.target.value)}
        />
      </div>
      <div className='input-group'>
        <div className='input-block'>
          <label htmlFor='latitude'>Latitude</label>
          <input
            type='number'
            name='latitude'
            id='latitude'
            required
            value={latitude}
            onChange={e => setLatitude(e.target.value)}
          />
        </div>
        <div className='input-block'>
          <label htmlFor='longitude'>Longitude</label>
          <input
            type='number'
            name='longitude'
            id='longitude'
            required
            value={longitude}
            onChange={e => setLatitude(e.target.value)}
          />
        </div>
      </div>
      <button type='submit'>Save</button>
    </form>
  );
}

export default DevForm;
