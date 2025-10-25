import { Button, Text } from '@react-navigation/elements';
import { StyleSheet, View } from 'react-native';
import { useCameraPermission } from 'react-native-vision-camera';
import { NotFound } from './NotFound';

export function Home() {
  const { hasPermission, requestPermission } = useCameraPermission()
  if(!hasPermission && !requestPermission())
    return <NotFound/>

  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Text>Open up 'src/App.tsx' to start working on your app!</Text>
      <Button screen="Profile" params={{ user: 'jane' }}>
        Go to Profile
      </Button>
      <Button screen="Settings">Go to Settings</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
});
