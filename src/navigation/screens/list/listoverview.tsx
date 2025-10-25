import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StatusBar, StyleSheet, View, Text, FlatList, ListRenderItem } from 'react-native';
import { CardsListRowPro } from '../../../objects/CardsListRowPro';
import { Button } from '@react-navigation/elements';


export default function listOverviewScreen({ route }) {
  let [liste, useListe] = React.useState<CardsListRowPro[]>([]);


  // const CardListRow = ({ id, title, amount }: CardsListRowPro) => (
  //   <View style={styles.container}>
  //     <Button>👎</Button>
  //     <Text>{amount}x </Text>
  //     <Button>👍</Button>
  //     <Text>{id}</Text>
  //     <Text>{title}</Text>
  //   </View>
  // )
  const CardListRow = ({ id, amount, title }: CardsListRowPro) => (
    <View style={styles.container}>
      <Button onPressOut={() => changeCardAmount(false, id)} >👎</Button>
      <Text>{amount}x </Text>
      <Button onPressOut={() => changeCardAmount(true, id)}>👍</Button>
      <Text>{id}</Text>
      <Text>{title}</Text>
    </View>
  )

  const changeCardAmount = async (increaseAmount: boolean, id: string) => {
    const newList = liste.map((x, y) => {
      if (x.id === id) {
        if (increaseAmount)
          x.amount += 1;
        else
          x.amount -= 1;
        return x;
      }
      else {
        return x;
      }
    });
    const item = newList.find(x => x.id === id)
    if (item !== null && item?.amount == 0) {
      await removeCardFromList(item.id);
      return;
    }
    await AsyncStorage.setItem(route.params.listId, JSON.stringify(newList));
    useListe(newList);
  }



  const removeCardFromList = async (id: string) => {
    const newList = liste.filter(x => x.id !== id);
    useListe(newList);
    await AsyncStorage.setItem(route.params.listId, JSON.stringify(newList));
  }

  React.useEffect(() => {
    const fetchData = async () => {
      const storageItem = await AsyncStorage.getItem(route.params.listId);
      console.log('storage', storageItem);

      if (storageItem == null) {
        return;
      }
      if (storageItem != null) {
        let cards: CardsListRowPro[] = JSON.parse(storageItem);
        console.log(cards);
        useListe(cards);
      }
    }
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Button screen='Scan' params={{ listId: route.params.listId }}>📷</Button>
      <FlatList data={liste}
        renderItem={({ item }) =>
        (
          <CardListRow amount={item.amount} id={item.id} title={item.title}></CardListRow>
        )}>
      </FlatList>
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});