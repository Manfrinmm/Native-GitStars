import React, { Component } from "react";
import { View, ActivityIndicator } from "react-native";
import api from "../../services/api";

import {
  Container,
  Avatar,
  Header,
  Name,
  Bio,
  Starts,
  Starred,
  Info,
  OwnerAvatar,
  Title,
  Author,
  Touch
} from "./styles";

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam("user").name
  });

  state = {
    starts: [],
    page: 1,
    loading: false,
    loadingList: false
  };

  async componentDidMount() {
    const { navigation } = this.props;
    this.setState({ loading: true });
    const { page } = this.state;
    const user = navigation.getParam("user");
    const { data } = await api.get(`users/${user.login}/starred?page=${page}`);
    this.setState({ starts: data, loading: false });
  }

  refreshList = async login => {
    this.setState({ loading: true });

    const { data } = await api.get(`users/${login}/starred`);

    this.setState({ starts: data, loading: false });
  };

  handleSite = item => {
    const { navigation } = this.props;
    navigation.navigate("Repo", { item });
  };

  loadMore = async () => {
    const { navigation } = this.props;
    const user = navigation.getParam("user");
    const { page, starts } = this.state;

    this.setState({ page: page + 1, loadingList: true });

    const { data } = await api.get(
      `users/${user.login}/starred?page=${page + 1}`
    );

    this.setState({ starts: [...starts, ...data], loadingList: false });
  };

  handleStarts = item => (
    <Starred>
      <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
      <Info>
        <Touch onPress={() => this.handleSite(item)}>
          <Title>{item.name}</Title>
          <Author>{item.owner.login}</Author>
        </Touch>
      </Info>
    </Starred>
  );

  render() {
    const { navigation } = this.props;

    const { starts, loading, loadingList } = this.state;

    const user = navigation.getParam("user");

    console.tron.log(starts);
    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {loading ? (
          <ActivityIndicator size={24} style={{ marginTop: 15 }} />
        ) : (
          <Starts
            data={starts}
            keyExtractor={start => String(start.id)}
            renderItem={({ item }) => this.handleStarts(item)}
            onRefresh={() => this.refreshList(user.login)}
            refreshing={loading}
            onEndReachedThreshold={0.2}
            onEndReached={this.loadMore}
            ListFooterComponent={() =>
              loadingList && <ActivityIndicator size="small" />
            }
          />
        )}
      </Container>
    );
  }
}
