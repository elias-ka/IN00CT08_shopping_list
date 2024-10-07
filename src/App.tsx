import { StatusBar } from "expo-status-bar";
import { FlatList, StyleSheet, View } from "react-native";
import {
  addDoc,
  collection,
  converter,
  firestore,
  SHOPPING_LIST,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "./data/db";
import ShoppingListEntry from "./models/ShoppingListEntry";
import { registerRootComponent } from "expo";
import {
  Divider,
  PaperProvider,
  Snackbar,
  TextInput,
  Appbar,
  ProgressBar,
} from "react-native-paper";
import { useCallback, useEffect, useState } from "react";
import ShoppingListItem from "./components/ShoppingListItem";

export default function App() {
  const [entries, setEntries] = useState<ShoppingListEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  // Used for undoing a delete operation
  const [recentlyDeletedEntry, setRecentlyDeletedEntry] =
    useState<ShoppingListEntry | null>(null);

  useEffect(() => {
    const ref = collection(firestore, SHOPPING_LIST).withConverter(
      converter<ShoppingListEntry>()
    );
    const unsubscribe = onSnapshot(
      query(ref, orderBy("timestamp", "asc")),
      (snapshot) => {
        setEntries(
          snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))
        );
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const onSaveEntry = async () => {
    try {
      if (!input.trim()) {
        return;
      }
      setInput("");
      await addDoc(collection(firestore, SHOPPING_LIST), {
        text: input,
        checked: false,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const onEntryCheck = async (entry: ShoppingListEntry) => {
    try {
      await updateDoc(doc(firestore, SHOPPING_LIST, entry.id), {
        checked: !entry.checked,
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const onEntryDelete = async (entry: ShoppingListEntry) => {
    try {
      setRecentlyDeletedEntry(entry);
      await deleteDoc(doc(firestore, SHOPPING_LIST, entry.id));
      setShowSnackbar(true);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const onUndoDelete = async () => {
    if (recentlyDeletedEntry) {
      try {
        await addDoc(
          collection(firestore, SHOPPING_LIST),
          recentlyDeletedEntry
        );
        setRecentlyDeletedEntry(null);
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };

  const keyExtractor = useCallback((item: ShoppingListEntry) => item.id, []);
  const renderItem = useCallback(
    ({ item }: { item: ShoppingListEntry }) => (
      <ShoppingListItem
        item={item}
        onCheck={onEntryCheck}
        onDelete={onEntryDelete}
      />
    ),
    []
  );
  const ItemSeparatorComponent = useCallback(() => <Divider />, []);

  return (
    <PaperProvider>
      <Appbar.Header>
        <Appbar.Content title="Shopping List" />
      </Appbar.Header>
      <ProgressBar visible={loading} indeterminate={true} />
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            mode="outlined"
            label="Add item"
            style={styles.input}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={onSaveEntry}
          />
        </View>
        <FlatList
          data={entries}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={ItemSeparatorComponent}
        />
        <StatusBar style="auto" />
      </View>
      <Snackbar
        visible={showSnackbar}
        onDismiss={() => setShowSnackbar(false)}
        action={{
          label: "Undo",
          onPress: onUndoDelete,
        }}
      >
        Item deleted
      </Snackbar>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  input: {
    flex: 1,
  },
});

registerRootComponent(App);
