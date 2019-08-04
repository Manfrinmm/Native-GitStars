import React from "react";

import { WebView } from "react-native-webview";

export default function Repo({ navigation }) {
  const repo = navigation.getParam("item");
  return <WebView source={{ uri: repo.html_url }} style={{ flex: 1 }} />;
}

Repo.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam("item").name
});
