import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Camera, useCameraDevice, useFrameProcessor } from 'react-native-vision-camera';
import { useTextRecognition } from 'react-native-vision-camera-ocr-plus';
import { } from 'react-native-vision-camera-ocr-plus'
import { useRunOnJS } from 'react-native-worklets-core';


export default function ScanScreen({route}) {
  const device = useCameraDevice('back');
  const { scanText } = useTextRecognition({ language: 'latin' });
  let liste = [''];

  const storeCardNumbers = useRunOnJS(async (value: string) => {
    try {
      if(liste == null || liste.includes(value))
        return;
      await AsyncStorage.setItem(route.params.listId, JSON.stringify(liste));
    } catch (e) {
      console.error(e)
    }
  }, []);


  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    const data = JSON.stringify(scanText(frame));
    if (data != undefined) {
      if (data.length > 0) {
        const regex = /[0-9][0-9]-[0-9][0-9][0-9][C,R,L,S,H]/;
        var s = regex.exec(data)
        if (s != null) {
          storeCardNumbers(s[0]);
        }
      }
    }


  }, []);

    React.useEffect(() => {
      const fetchData = async () => {
        let storageItem = await AsyncStorage.getItem(route.params.listId);
        if(storageItem != null)
        {
          liste = JSON.parse(storageItem);          
        }

      }
      fetchData();
    }, []);

  return (
    <>
      {!!device && (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive
          frameProcessor={frameProcessor}
          mode="recognize"
        />
      )}
    </>
  );
}
