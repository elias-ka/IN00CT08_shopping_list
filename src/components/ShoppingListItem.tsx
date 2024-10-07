import {
  Text,
  Checkbox,
  IconButton,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import ShoppingListEntry from "../models/ShoppingListEntry";
import { View, StyleSheet } from "react-native";

export default function ShoppingListItem({
  item,
  onCheck,
  onDelete,
}: {
  item: ShoppingListEntry;
  onCheck: (item: ShoppingListEntry) => void;
  onDelete: (item: ShoppingListEntry) => void;
}) {
  const theme = useTheme();

  return (
    <TouchableRipple
      borderless
      style={styles.ripple}
      onPress={() => onCheck(item)}
    >
      <View style={styles.rowView}>
        <Checkbox
          status={item.checked ? "checked" : "unchecked"}
          color={
            item.checked ? theme.colors.outlineVariant : theme.colors.outline
          }
          uncheckedColor={theme.colors.outline}
        />
        <Text
          style={{
            flex: 1,
            textDecorationLine: item.checked ? "line-through" : "none",
            color: item.checked
              ? theme.colors.backdrop
              : theme.colors.onSurface,
          }}
        >
          {item.text}
        </Text>
        <IconButton
          iconColor={
            item.checked ? theme.colors.backdrop : theme.colors.onSurface
          }
          icon="close"
          onPress={() => onDelete(item)}
        />
      </View>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  ripple: {
    borderRadius: 4,
  },
  rowView: {
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
  },
});
