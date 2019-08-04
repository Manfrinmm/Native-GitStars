import React, { Component } from "react";
import { Keyboard, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import api from "../../services/api";

import {
  Container,
  Form,
  Input,
  SubmitButton,
  List,
  User,
  Avatar,
  Name,
  Bio,
  ProfileButton,
  ProfileButtonText
} from "./styles";

export default class Main extends Component {
  static navigationOptions = {
    title: "Usuários"
  };

  state = {
    newUser: "",
    users: [],
    loading: false
  };

  async componentDidMount() {
    const users = await AsyncStorage.getItem("users");

    if (users) {
      this.setState({
        users: JSON.parse(users)
      });
    }
  }

  componentDidUpdate(_, prevState) {
    if (prevState.users !== this.state.users) {
      AsyncStorage.setItem("users", JSON.stringify(this.state.users));
    }
  }

  handleAddUser = async () => {
    const { users, newUser } = this.state;

    this.setState({ loading: true });
    const response = await api.get(`/users/${newUser}`);

    const data = {
      name: response.data.name,
      login: response.data.login,
      bio: response.data.bio,
      avatar: response.data.avatar_url
    };

    this.setState({
      users: [...users, data],
      newUser: "",
      loading: false
    });
    Keyboard.dismiss();
  };

  handleNavigate = user => {
    const { navigation } = this.props;
    navigation.navigate("User", { user });
  };

  handleList = item => {
    const user = item;
    console.tron.log(user);
    return (
      <User>
        <Avatar source={{ uri: user.avatar }} />
        <Name>{user.name}</Name>
        <Bio>{user.bio}</Bio>

        <ProfileButton onPress={() => this.handleNavigate(user)}>
          <ProfileButtonText>ver perfil</ProfileButtonText>
        </ProfileButton>
      </User>
    );
  };

  render() {
    const { users, newUser, loading } = this.state;
    return (
      <Container>
        <Form>
          <Input
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Adicionar usuário"
            value={newUser}
            onChangeText={text => this.setState({ newUser: text })}
            returnKeyType="send"
            onSubmitEditing={this.handleAddUser}
          />
          <SubmitButton loading={loading} onPress={this.handleAddUser}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Icon name="add" size={20} color="#fff" />
            )}
          </SubmitButton>
        </Form>

        <List
          data={users}
          keyExtractor={user => user.login}
          renderItem={({ item }) => this.handleList(item)}
        />
      </Container>
    );
  }
}
