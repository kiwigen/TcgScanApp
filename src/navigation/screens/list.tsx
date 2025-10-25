import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { Alert, FlatList, Keyboard, Pressable, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import uuid from 'react-native-uuid';
import { Button } from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';
import { CardListItem } from '../../objects/cardListItem';



export default function TabCardLists() {
  const navigation = useNavigation();
  let [liste, useListe] = React.useState<CardListItem[]>([]);
  const [text, onChangeText] = React.useState('');

  type ItemProps = { title: string, id: string };

  const Item = ({ title, id }: ItemProps) => (
    <View style={[styles.item]}>
       
      <Button screen="ListOverview" params={{name:title, listId:id}}> <Text style={styles.title}>{title}</Text>
      </Button>
              <Pressable onPress={async () => { await onRemoveClick(id); }} >
          <Text style={styles.removeButton}>🗑️</Text>
        </Pressable>
</View>
  );


  const getCardLists = async (): Promise<CardListItem[]> => {
    try {
      const jsonValue = await AsyncStorage.getItem("cardLists");
      let f = jsonValue != null ? JSON.parse(jsonValue) : [];
      return f;

    } catch (error) {
      throw (error)
    }
  };


  const onAddClick = async () => {
    if (typeof text != 'undefined' && text) {
      useListe(await saveCardLists());
      await Keyboard.dismiss();
      onChangeText('');
    }
    else {
      Alert.alert('Achtung', 'Listenname darf nicht leer sein.');
    }
  }

  const onRemoveClick = async (id: string) => {
    const cardList = await deleteCardList(id);
    await AsyncStorage.setItem("cardLists", JSON.stringify(cardList));
    useListe(cardList);
  }

  const saveCardLists = async (): Promise<CardListItem[]> => {
    try {
      let cardList: CardListItem = new CardListItem();
      cardList.id = uuid.v1().toString();
      cardList.title = text;
      const newCardList = [...liste, cardList];
      await AsyncStorage.setItem("cardLists", JSON.stringify(newCardList));
      // await AsyncStorage.setItem(cardList.id, JSON.stringify(['']));


      return newCardList;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  const deleteCardList = async (id: string): Promise<CardListItem[]> => {
    const cardList = await getCardLists();
    let newCardList = cardList.filter(x => x.id != id);
    return newCardList;
  }



  React.useEffect(() => {
    const fetchData = async () => {
      useListe(await getCardLists());
    }
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={[{ marginLeft: 25, marginTop: 25 }]}>Listenname</Text>
      <View style={styles.titleContainer}>
        <TextInput style={[styles.input]} onChangeText={onChangeText} value={text}></TextInput>
        <Pressable onPress={async () => { await onAddClick(); }} >
          <Text style={styles.addButton}>+</Text>
        </Pressable>
      </View>
      <Text style={[{ marginLeft: 25, marginTop: 25 }]}>Listen</Text>
      <FlatList
        data={liste}
        renderItem={({ item }) => <Item title={item.title} id={item.id} />}
        keyExtractor={item => item.id}
      />
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
    padding: 25,
    flexDirection: 'row',   // ⬅️ sorgt dafür, dass Input und Button nebeneinander stehen
    alignItems: 'center',   // ⬅️ vertikale Ausrichtung auf derselben Höhe
    marginVertical: 10,

  },
  input: {
    flex: 1,                // ⬅️ Input nimmt den verfügbaren Platz ein
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginRight: 8,
  },
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    flexDirection: 'row',          // Text und Button nebeneinander
    justifyContent: 'space-between', // Text links, Button rechts
    alignItems: 'center',          // vertikal auf gleicher Höhe
    backgroundColor: '#4a4a4a4a',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  removeButton: {
    width: 40,
    height: 40,
    fontSize: 30,
    margin: 5,
    backgroundColor: 'white',
  },
  addButton: {
    fontSize: 24,
    color: 'blue',
    width: 40,
    height: 40,
    textAlign: 'center',
    textAlignVertical: 'center',
  }

});
