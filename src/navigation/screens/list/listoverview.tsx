import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StatusBar, StyleSheet, View, Text, FlatList } from 'react-native';


export default function listOverviewScreen({ route }) {
  let [liste, useListe] = React.useState<string[]>([]);



  type ItemProps = { title: string, id: string };
  const CardListRow = ({id, title}:ItemProps) =>(
      <View style={styles.container}>
        <Text>{id}</Text>
        <Text>{title}</Text>
      </View>
  )



  React.useEffect(() => {
    const fetchData = async () => {
      let g = await AsyncStorage.getItem(route.params.listId);
      if (g != null) {
        let s = JSON.parse(g);
        useListe(s);
      }
    }
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Button screen='Scan' params={{listId:route.params.listId}}>📷</Button>
      <FlatList data={liste}
        renderItem={({ item }) => <CardListRow id={item} title={item}></CardListRow>}>
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