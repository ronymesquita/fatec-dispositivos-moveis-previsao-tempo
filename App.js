import { StyleSheet, Text, View, SafeAreaView, Image } from 'react-native';
import { useState } from 'react';
import { Button, Provider, InputItem, List, WhiteSpace } from '@ant-design/react-native';
import { GEOLOCATION_API_URL, FORECAST_API_URL, ICON_URL, LANGUAGE, APP_ID } from '@env';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';

export default function App() {
  const [city, setCity] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [forecast, setForecast] = useState(null);

  const searchGeolocation = async () => {
    const geolocationResponse = await fetch(`${GEOLOCATION_API_URL}/direct?q="${city}"&limit=1&appid=${APP_ID}`);
    const geolocations = await geolocationResponse.json();

    if (Array.isArray(geolocations)) {
      const geolocation = geolocations[0];

      setLatitude(geolocation.lat);
      setLongitude(geolocation.lon);
    }
  };

  const searchForecast = async () => {
    const forecastResponse = await fetch(`${FORECAST_API_URL}/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,daily,alerts&units=metric&lang=${LANGUAGE}&appid=${APP_ID}`);
    const forecastData = await forecastResponse.json();

    setForecast(forecastData.current);
  };

  return (
    <Provider>
      <SafeAreaView style={styles.container}>
        <View style={{
          display: 'flex',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
          paddingLeft: 24,
          paddingRight: 24
        }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: '600'
            }}>Tempo Hoje</Text>

          <WhiteSpace size='xl' />

          <List>
            <InputItem
              placeholder='Cidade'
              onChangeText={setCity} />
          </List>

          <WhiteSpace size='sm' />

          <Text
            style={{
              color: '#aaa'
            }}>Exemplo: São Paulo</Text>

          <WhiteSpace size='lg' />

          <Button
            type='primary'
            onPress={async () => {
              await searchGeolocation();
              await searchForecast();
            }}
          >Buscar</Button>

          <WhiteSpace size='lg' />

          {forecast !== null && ((() => {
            const day = new Date(forecast.sunrise * 1000).toLocaleDateString('pt-BR', { year: 'numeric', month: 'numeric', day: 'numeric' });
            const sunrise = new Date(forecast.sunrise * 1000).toLocaleString('pt-BR', { hour: 'numeric', minute: 'numeric' });
            const sunset = new Date(forecast.sunset * 1000).toLocaleString('pt-BR', { hour: 'numeric', minute: 'numeric' });
            const feelsLike = new Intl.NumberFormat('pt-BR').format(forecast.feels_like);

            return <View
              style={{
                padding: 8,
                borderRadius: 6,
                minHeight: '24%',
                backgroundColor: '#87CEEB'
              }}>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Image
                  style={{ width: 64, height: 64 }}
                  source={{ uri: `${ICON_URL}/${forecast.weather[0].icon}@2x.png` }} />

                <Text
                  style={{
                    color: '#ffffff',
                    fontSize: 20,
                    fontWeight: '400'
                  }}>{forecast.weather[0].description}</Text>
              </View>

              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{
                    color: '#ffffff',
                    fontSize: 16,
                  }}>Dia</Text>
                  <Text style={{
                    color: '#ffffff',
                    fontSize: 16,
                    fontWeight: '400'
                  }}>{day}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{
                    color: '#ffffff',
                    fontSize: 16,
                  }}>Sensação térmica</Text>
                  <Text style={{
                    color: '#ffffff',
                    fontSize: 16,
                    fontWeight: '400'
                  }}>{feelsLike} °C</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{
                    color: '#ffffff',
                    fontSize: 16,
                  }}>Nascer do Sol</Text>
                  <Text style={{
                    color: '#ffffff',
                    fontSize: 16,
                    fontWeight: '400'
                  }}>{sunrise}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{
                    color: '#ffffff',
                    fontSize: 16,
                  }}>Pôr do Sol</Text>
                  <Text style={{
                    color: '#ffffff',
                    fontSize: 16,
                    fontWeight: '400'
                  }}>{sunset}</Text>
                </View>
              </View>
            </View>
          })())}
        </View>
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 64,
  }
});
