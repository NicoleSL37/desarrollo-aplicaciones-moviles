import { SafeAreaView, StyleSheet, View } from 'react-native';
import ProfileCard from './src/components/ProfileCard';
import GridDemo from './src/screens/GridDemo';

export default function App() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <GridDemo />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F1F5F9' },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
});
