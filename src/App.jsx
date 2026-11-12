import './App.css'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CloudIcon from '@mui/icons-material/Cloud';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useEffect, useState } from 'react';
import 'moment/min/locales';
import 'moment/locale/ar.js';
import moment from 'moment/min/moment-with-locales';
import { useTranslation } from 'react-i18next';

moment.locale("ar");
const theme = createTheme({
  typography: {
    fontFamily: ['rak'],
  }
})

let ca = null;
function App() {
  const { t, i18n } = useTranslation();
  const [dateAndTime, setDateAndTime] = useState('');
  const [temp, setTemp] = useState({
    number: null,
    description: '',
    min: null,
    max: null,
    icon: null,
  });

  const [local, setLocal] = useState('ar');

  const direction = local == 'ar' ? 'rtl' : 'ltr';

  // event handler :
  function handleLanguageClick() {
    if (local == 'en') {
      setLocal('ar');
      i18n.changeLanguage('ar');
      moment.locale("ar");
    }
    else {
      setLocal('en');
      i18n.changeLanguage('en');
      moment.locale("en");
    }
    setDateAndTime(moment().format("MMM - Do - YYYY"));
  }

  useEffect(() => {
    i18n.changeLanguage(local);
  }, []);

  useEffect(() => {
    setDateAndTime(moment().format("MMM - Do - YYYY"));
    axios
      .get(
        "https://api.openweathermap.org/data/2.5/weather?lat=34.72682&lon=36.72559&appid=0557d4bd108f28977016ccfe3d56412b",
        {
          cancelToken: new axios.CancelToken((c) => {
            ca = c;
          })
        }
      )
      .then((response) => {
        const responseTemp = Math.round(response.data.main.temp - 272.15);
        const min = Math.round(response.data.main.temp_min - 272.15);
        const max = Math.round(response.data.main.temp_max - 272.15);
        const description = response.data.weather[0].description;
        const responseIcon = response.data.weather[0].icon;
        console.log(response);
        setTemp({
          number: responseTemp,
          description: description,
          min: min,
          max: max,
          icon: `https://openweathermap.org/payload/api/media/file/${responseIcon}.png`,
        });
      })
      .catch((error) => {
        console.error(error);
      })
    return () => {
      console.log('canceling the request');
      ca();
    }
  }, []);


  return (
    <div className='App'>
      <ThemeProvider theme={theme}>
        <Container maxWidth="sm">
          {/* content container */}
          <div style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}>
            {/* card */}
            <div dir={direction}
              style={{
                width: '100%',
                background: 'rgb(28 52 91 / 364)',
                color: 'white',
                padding: '10px',
                borderRadius: '15px',
                boxShadow: '0px 11px 1px rgba(0, 0, 0, 0.05)',
              }}>
              {/* content */}
              <div style={{
                // display: 'flex',
              }}>
                {/* city & time */}
                <div style={{
                  display: 'flex',
                  alignItems: 'end',
                  justifyContent: 'start',
                }}
                  dir={direction}>
                  <Typography variant="h2" sx={{
                    marginRight: '20px',
                  }}>
                    {t('Homs')}
                  </Typography>

                  <Typography variant="h5" sx={{
                    marginRight: '20px',
                  }}>
                    {dateAndTime}
                  </Typography>
                </div>
                {/* ===city & time */}
                <hr />
                {/* container of degree &cloud icon */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                }}>
                  {/* degree & description */}
                  <div>
                    {/* temprature */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <Typography variant="h1" sx={{
                        textAlign: 'right',
                      }}>
                        {temp.number}
                      </Typography>

                      <img src={temp.icon} />

                    </div>
                    {/* ===temprature */}
                    <Typography variant="h6">
                      {t(temp.description)}
                    </Typography>
                    {/* min & max */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <h5>{t('min')} : {temp.min}</h5>
                      <h5 style={{ margin: '0px 5px' }}>|</h5>
                      <h5>{t('max')} : {temp.max}</h5>
                    </div>
                  </div>
                  {/* ===degree & description */}
                  <CloudIcon style={{ fontSize: '200px', color: 'white' }} />
                </div>
                {/* container of degree &cloud icon */}
              </div>
              {/* ===content */}
            </div>
            {/* ===card */}
            {/* translation container */}
            <div dir={direction}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'end',
                marginTop: '10px',
              }}>
              <Button variant="text" style={{
                color: 'white',
              }} onClick={handleLanguageClick}
              >{local == 'en' ? 'Arabic' : 'انجليزي'}</Button>
            </div>
            {/* ===translation container */}
          </div>
          {/* ===content container */}
        </Container>
      </ThemeProvider>
    </div>
  )
}

export default App
