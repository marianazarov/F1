import React, { useState } from 'react';

const api = {
  key: '1dfa49c26bdf1a5cfa305eb4bce196f5',
  base: 'http://api.openweathermap.org/data/2.5/'
}

function format_date(d) {
    let months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    let days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
}


function App() {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState({});
    const [timeframe, setTimeframe] = useState('now');
    const [forecastData, setForecastData] = useState(null);

    const search = evt => {
        if (evt.key === 'Enter') {
            Promise.all([
                fetch(`${api.base}weather?q=${city}&units=metric&appid=${api.key}`), // Fetch current weather
                fetch(`${api.base}forecast?q=${city}&units=metric&appid=${api.key}`),
            ])
                .then(responses => Promise.all(responses.map(res => res.json())))
                .then(results => {
                    const [currentWeather, forecastWeather] = results;
                    setWeather({ current: currentWeather, forecast: forecastWeather });
                    setCity('');
                    console.log(currentWeather, forecastWeather);
                });
        }
    }

    return (
        <div className={(typeof weather.main !== 'undefined') ? ((weather.main.temp > 16) ? 'app warm' : 'app') : 'app'}>
            <main>
                <div className='search-box'>
                    <input
                        type='text'
                        className='search-bar'
                        placeholder='Введите город...'
                        onChange={e => setCity(e.target.value)}
                        value={city}
                        onKeyPress={search}
                    />
                </div>
                {(weather.current && weather.forecast) ? (
                    <div>
                        <div className='location-box'>
                            <div className='location'>{weather.current.name}, {weather.current.sys.country}</div>
                            <div className='date'>{format_date(new Date())}</div>
                        </div>
                        <div className='weather-box'>
                            <div className='temp'>
                                {Math.round(weather.current.main.temp)}°c
                            </div>
                            <div className='weather'>{weather.current.weather[0].main}</div>
                        </div>
                        <div className='forecast-box'>
                            {weather.forecast.list.filter((item, index) => index % 8 === 0).map((forecastItem, index) => (
                                <div key={index} className='forecast-item'>
                                    <div>{format_date(new Date(forecastItem.dt * 1000))}</div>
                                    <div>Day: {Math.round(forecastItem.main.temp_max)}°c</div>
                                    <div>Night: {Math.round(forecastItem.main.temp_min)}°c</div>
                                    <div>{forecastItem.weather[0].main}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : ('')}
                </main>
        </div>
    );
}

export default App;
