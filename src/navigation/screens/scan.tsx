import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Camera, useCameraDevice, useFrameProcessor } from 'react-native-vision-camera';
import { useTextRecognition } from 'react-native-vision-camera-ocr-plus';
import { } from 'react-native-vision-camera-ocr-plus'
import { useRunOnJS } from 'react-native-worklets-core';
import { CardsListRowPro } from '../../objects/CardsListRowPro';


export default function ScanScreen({route}) {
  const device = useCameraDevice('back');
  const { scanText } = useTextRecognition({ language: 'latin' });
  let liste : CardsListRowPro[] = [];

  const storeCardNumbers = useRunOnJS(async (value: string) => {
    try {
      if(liste == null || liste.map(x=>x.id).includes(value))
        return;
      let item = new CardsListRowPro()
      item.amount = 1;
      item.id = value;
      item.title = value;       
      liste.push(item)
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
        var regexResult = regex.exec(data)
        if (regexResult != null) {
          storeCardNumbers(regexResult[0]);
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
