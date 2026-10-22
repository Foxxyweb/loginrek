import { render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from '@/app/index';

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

describe('<HomeScreen />', () => {
  test('menampilkan nama aplikasi dan tombol cek API', async () => {
    const { getByText } = await render(
      <SafeAreaProvider initialMetrics={metrics}>
        <HomeScreen />
      </SafeAreaProvider>,
    );

    getByText('loginrek');
    getByText('Cek koneksi API');
  });
});
